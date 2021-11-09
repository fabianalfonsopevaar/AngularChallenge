import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../service/shoppingCart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();
  searchText: string;
  numberOfItems: number=0
  constructor(
    private router: Router,
    private cart: ShoppingCartService
  ) { 
    this.cart.eventEmitter.subscribe(n => {
      this.numberOfItems=n
    })
  }

  ngOnInit(): void {
    this.numberOfItems=this.cart.getNumberOfItems()
  }

  outText(){
    this.newItemEvent.emit(this.searchText);
  }

  // cart(){
  //   this.router.navigate(['/cart/'])
  // }

}
