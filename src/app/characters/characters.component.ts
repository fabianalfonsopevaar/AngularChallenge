import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import axios from 'axios';
import md5 from 'md5';
import {environment} from '../../environments/environment'
import { ShoppingCartService } from '../service/shoppingCart.service';


@Component({
  selector: 'app-characters',
  templateUrl:'./characters.component.html',
  styles: [
  ]
})
export class CharactersComponent implements OnInit {
  characters = [] as any;
  data = [] as any;
  favorites = [] as any;
  modalRef: MDBModalRef;
  spinner: boolean;

  selectedOption: number;

  pageSize: number;
  pageNumber: number;
  total: number;
  offset: number;

  totalShow: number;

  @Input() searchText: string;
  @Input() toDelete: string;
  @Output() favEvent = new EventEmitter<any[]>();
  constructor(private modalService: MDBModalService, private cart: ShoppingCartService) {
    this.spinner = true

    this.selectedOption = 0;

    this.pageSize = 10;
    this.pageNumber = 0;
    this.total = 0;
    this.offset = 0;

    this.totalShow = 0;
   }

  ngOnInit(): void {
    this.getCharacters(this.pageSize,this.offset,this.searchText);
  }

  getCharacters(lim: number, off: number,sw: string){
    this.spinner = true;
    var prm = {
      params: {
        "apikey": environment.publicKey,
        "ts": environment.ts,
        "hash": md5(environment.ts  + environment.privateKey + environment.publicKey),
        "limit":lim,
        "offset": off
      }
    };

    if(sw != '' && sw != undefined){
      prm.params["nameStartsWith"] = sw
    }
    if(this.selectedOption == 1){
      prm.params["orderBy"] = "name"
    }else if(this.selectedOption == 2){
      prm.params["orderBy"] = "-name"
    }else if(this.selectedOption == 3){
      prm.params["orderBy"] = "modified"
    }else if(this.selectedOption == 4){
      prm.params["orderBy"] = "-modified"
    }
    axios.get(environment.endpoint+'/characters',prm)
    .then(response => {
        this.characters = response.data.data.results
        this.characters.forEach(e => {
          e.modified = this.formatDate(e.modified)
        });
        this.data = this.characters.slice(0, this.pageSize)
        this.spinner = false
        this.total = response.data.data.total;
        this.totalShow = Math.ceil(this.total/10)
    })
    .catch(e => {
        this.spinner = false
        console.log(e.response)
    })
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  addFavorite() {
    this.favEvent.emit(this.favorites);
  }

  ngOnChanges(event){
    if(event.searchText){
      if(event.searchText.currentValue){
        this.pageNumber = 0;
        this.offset = this.pageNumber * this.pageSize
        this.getCharacters(10,this.offset,event.searchText.currentValue);
      }else{
        this.pageNumber = 0;
        this.offset = this.pageNumber * this.pageSize
        this.getCharacters(10,this.offset,this.searchText);
      }
    }
    if(event.toDelete){
      var arr = this.favorites
      var newData: any[] = arr.filter(x => x.id !=event.toDelete.currentValue)
      if(!newData) newData = []
      this.favorites = newData
      this.addFavorite()
    }
  }

  addOffset(){
    if((this.pageNumber + 1) * this.pageSize <= this.total){
      this.pageNumber = this.pageNumber + 1
      this.offset = this.pageNumber * this.pageSize
      this.getCharacters(10,this.offset,this.searchText);
    }
  }
  remOffset(){
    if((this.pageNumber - 1) * this.pageSize >= 0){
      this.pageNumber = this.pageNumber - 1
      this.offset = this.pageNumber * this.pageSize
      this.getCharacters(10,this.offset,this.searchText);
    }
  }

  onClickComic(uri){
    this.modalRef = this.modalService.show(ModalComponent,{
      data:
      {
        resourceUri: uri,
        favorites: this.favorites,
        cart: this.cart
      }
    })
    this.modalRef.content.action.subscribe( (result: any) => { 
      this.favorites = result
      this.addFavorite()
    });
  }

  handleSelect(event){
    this.selectedOption = event.target.value
    this.pageNumber = 0;
    this.offset = this.pageNumber * this.pageSize
    this.getCharacters(10,this.offset,this.searchText)
  }

}
