import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import axios from 'axios';
import {environment} from '../../environments/environment'
import md5 from 'md5';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styles: [
  ]
})
export class CheckoutComponent implements OnInit {

  comic: any;
  card: any;

  array: number[] = [10,100,1000];
  price: number;

  constructor(private toastr: ToastrService, private router: Router,private route: ActivatedRoute) {
    const randomElement = this.array[Math.floor(Math.random() * this.array.length)];
    this.price = Number.parseInt(Math.random()* randomElement + "")
  }

  async ngOnInit(): Promise<void> {
    window['checkoutComponent'] = this;
    const payPalScript = document.createElement("script");
    payPalScript.type = "text/javascript";
    payPalScript.src = "https://www.paypal.com/sdk/js?client-id=" + environment.pClientId;
    document.head.appendChild(payPalScript);
    

    this.route.params.subscribe(params => {
        this.getComic(params['id'])
    });


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
          var amountFinal = window['checkoutComponent'].price;

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

  async buySquare(event){
    event.preventDefault()
    try {
      const result = await this.card.tokenize();
      if (result.status === 'OK') {
        this.takePayment(result.token); 
      }
    } catch (e) {
      this.toastr.error("Something wrong happened")
    }
  }

  takePayment(token){
    const body = {
      Token: token,
      Name: this.comic.title,
      Amount: this.price 
    }
    
    axios.post(environment.GCPFunction, body)
    .then(res => {
      this.toastr.success("Payment succeded")
      this.router.navigate(["/"])

    }).catch(err =>{
      this.toastr.error("Something wrong happened")
    })
  }
  ngOnDestroy(): void {
    window['checkoutComponent'] = undefined;
  }

  getComic(id){
    axios.get(environment.endpoint+'/comics/'+id,{
        params: {
          "apikey": environment.publicKey,
          "ts": environment.ts,
          "hash": md5(environment.ts  + environment.privateKey + environment.publicKey)
      }})
      .then(response => {
          this.comic = response.data.data.results[0]
          console.log(this.comic)
      })
      .catch(e => {
          console.log(e.response)
      })
  }

  outText(event){
    
  }

  // this will handle when the transaction is approved
  private paypalOnApprove(data: any, actions: any) {
    // This function captures the funds from the transaction.
    return actions.order.capture().then(details => {
      // This function shows a transaction success message to your buyer.
      if (details.status == "COMPLETED") {
        const paymentId = details.purchase_units[0].payments.captures[0].id;
        this.toastr.success("Payment succeded")
        this.router.navigate(["/"])
      } else {
        this.toastr.error('Something went wrong while performing the Paypal payment. Payment Status: ' + details.status);
      }
    });
  }

}
