import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from '../service/shoppingCart.service';
import {environment} from '../../environments/environment'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import axios from 'axios'
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { ModalSuccessComponent } from '../modal-success/modal-success.component';


@Component({
  selector: 'shopping-cart',
  templateUrl:'./shoppingCart.component.html',
  styles: [
  ]
})
export class ShoppingCartComponent implements OnInit {

  items: Array<any>;

  randomPrice: number;

  array: number[] = [10,100,1000];

  card: any;

  modalRef: MDBModalRef;
  
  constructor(private cart: ShoppingCartService,private toastr: ToastrService,private router: Router, private modalService: MDBModalService) {

    const randomElement = this.array[Math.floor(Math.random() * this.array.length)];

    this.items = this.cart.getItems()
    this.calculateTotal()
    this.cart.eventEmitter.subscribe(x => {
      this.items = this.cart.getItems()
      this.calculateTotal()
    })
   }

  async ngOnInit(): Promise<void> {
    if(this.items && this.items.length > 0 ){
      window['checkoutComponent'] = this;
      const payPalScript = document.createElement("script");
      payPalScript.type = "text/javascript";
      payPalScript.src = "https://www.paypal.com/sdk/js?client-id=" + environment.pClientId;
      document.head.appendChild(payPalScript);

      const payments = (<any>window).Square.payments(environment.applicationId,environment.locationId);
      this.card = await payments.card();
      await this.card.attach('#card-container');


      const elementExist = document.getElementById('paypal-button-container');
      if (elementExist) {
        window['paypal'].Buttons({
          locale: 'en_US',
          style: {
            color: 'gold',
            shape: 'pill',
            size: 'large',
            label: 'pay',
            height: 40,
            layout: 'horizontal'
          },
          createOrder: function (data, actions) {
            // This function sets up the details of the transaction, including the amount and line item details.
            var amountFinal = window['checkoutComponent'].randomPrice;

            var purchaseObj = {
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    value: amountFinal,
                    currency_code: 'USD'
                  }
                }
              ]
            };
            return actions.order.create(purchaseObj);
          },
          onApprove: function (data, actions) {
            window['checkoutComponent'].paypalOnApprove(data, actions);
          }
        }).render('#paypal-button-container');
      }
    }
  }
  outText(event){
  }

  openModal(bool) {
    this.modalRef = this.modalService.show(ModalSuccessComponent,{
      data: {succeeded: bool}
    })
  }
  closeModal() {
    this.modalRef.hide()
  }

  calculateTotal(){
    let tmp = this.items.map(x => x.id*x.qty).reduce((partial_sum, a) => partial_sum + a, 0);
    if(tmp && tmp <=0 ){
      this.toastr.error("The amount MUST be greater than zero")
      return
    }else if(this.items.some(i => i.qty <= 0)){
      this.toastr.error("The quantity of the items MUST be greater than zero")
      this.items.forEach(i => {
        if(i.qty <= 0) i.qty = 1
      })
      return
    }
    this.randomPrice = tmp
  }

  delete(id){
    this.cart.deleteItem(id)
  }

  async buySquare(event){
    event.preventDefault()
    try {
      this.openModal(false)
      const result = await this.card.tokenize();
      if (result.status === 'OK') {
        this.takePayment(result.token); 
      }
    } catch (e) {
      this.toastr.error("Something wrong happened")
    }
  }

  takePayment(token){

    if(this.randomPrice && this.randomPrice <=0 ){
      this.toastr.error("The amount MUST be greater than zero")
      return
    }else if(this.items.some(i => i.qty <= 0)){
      this.toastr.error("The quantity of the items MUST be greater than zero")
      return
    }

    const body = {
      Token: token,
      Name: 'Buy',
      Amount: this.randomPrice 
    }
    
    axios.post(environment.GCPFunction, body)
    .then(res => {
      this.closeModal()
      this.openModal(true)
      this.toastr.success("Payment succeded")
      this.router.navigate(["/"])
      this.cart.clearCart()
    }).catch(err =>{
      this.toastr.error("Something wrong happened")
    })
  }

  ngOnDestroy(): void {
    window['checkoutComponent'] = undefined;
  }

  private paypalOnApprove(data: any, actions: any) {
    // This function captures the funds from the transaction.
    return actions.order.capture().then(details => {
      // This function shows a transaction success message to your buyer.
      if (details.status == "COMPLETED") {
        const paymentId = details.purchase_units[0].payments.captures[0].id;
        this.cart.clearCart()
        this.toastr.success("Payment succeded")
        this.router.navigate(["/"])
      } else {
        this.toastr.error('Something went wrong while performing the Paypal payment. Payment Status: ' + details.status);
      }
    });
  }
}
