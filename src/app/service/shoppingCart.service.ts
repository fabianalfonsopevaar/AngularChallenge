import { EventEmitter, Inject, Injectable } from '@angular/core';

@Injectable()
/**
 * Service class.
 */
export class ShoppingCartService {


    eventEmitter: EventEmitter<number> = new EventEmitter();

    /**
     * KEY_SHOPPING_CART.
     * @type {string}
     */
    private KEY_SHOPPING_CART = 'KEY_SHOPPING_CART';

    /**
     * Number of items in the cart.
     * @type {number}
     */
    private numberOfItems: number = 0;

    /**
     * Number of items in the cart.
     * @type {any}
     */
     private items: Array<any>;

    constructor() {
        this.items = new Array();
        var itemsTemp: Array<any> = JSON.parse(localStorage.getItem(this.KEY_SHOPPING_CART))
        if(!itemsTemp){
            console.log("Its new")
            localStorage.setItem(this.KEY_SHOPPING_CART,JSON.stringify([]))
            this.numberOfItems = 0
        }else{
            this.items = itemsTemp
            this.numberOfItems = itemsTemp.length;
        }
    }

    getEventEmmiter(): EventEmitter<number>{
        return this.eventEmitter
    }

    getItems(): Array<any>{
        return JSON.parse(localStorage.getItem(this.KEY_SHOPPING_CART)) ? JSON.parse(localStorage.getItem(this.KEY_SHOPPING_CART)): []
    }

    getNumberOfItems():number {
        return this.numberOfItems
    }

    addItem(item: any){
        item.qty = item.qty ? item.qty : 1
        item.total_price = item.id
        this.items.push(item)
        this.numberOfItems = this.items.length
        this.saveInLocalStorage()
        this.eventEmitter.emit(this.numberOfItems)
    }
    
    check(item: any){
        if(this.items.some(x => x.id === item.id)){
            return false
        }else{
            return true
        }
    }

    deleteItem(id){
        this.items = this.items.filter(x => x.id != id)
        this.numberOfItems = this.items.length
        this.saveInLocalStorage()
        this.eventEmitter.emit(this.numberOfItems)
    }

    saveInLocalStorage(){
        localStorage.setItem(this.KEY_SHOPPING_CART,JSON.stringify(this.items))
    }

    clearCart(){
        this.items = []
        this.numberOfItems = this.items.length
        this.saveInLocalStorage()
        this.eventEmitter.emit(this.numberOfItems)
    }

}
