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

    this.route.params.subscribe(params => {
        this.getComic(params['id'])
    });


    const payments = (<any>window).Square.payments(environment.applicationId,environment.locationId);
    this.card = await payments.card();
    await this.card.attach('#card-container');
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

}
