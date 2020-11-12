import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import {results} from './characters.js'
import {PageEvent} from '@angular/material/paginator';
import { ModalComponent } from '../modal/modal.component';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import axios from 'axios';
import md5 from 'md5';
import {environment} from '../../environments/environment'

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
  pageSize: any;
  pageEvent: PageEvent;
  modalRef: MDBModalRef;
  spinner: boolean;
  @Input() searchText: string;
  @Input() toDelete: string;
  @Output() favEvent = new EventEmitter<any[]>();
  constructor(private modalService: MDBModalService) {
    this.pageSize = 10;
    this.spinner = true;
    this.data = this.characters.slice(0,this.pageSize)
   }

  ngOnInit(): void {
    this.getCharacters(50);
  }

  getCharacters(lim: number){
    axios.get(environment.endpoint+'/characters',{
      params: {
        "apikey": environment.publicKey,
        "ts": environment.ts,
        "hash": md5(environment.ts  + environment.privateKey + environment.publicKey),
        "limit":lim
    }})
    .then(response => {
        this.characters = response.data.data.results
        this.characters.forEach(e => {
          e.modified = this.formatDate(e.modified)
        });
        this.data = this.characters.slice(0, this.pageSize)
        this.spinner = false
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
        var copy = this.characters.filter(x => x.name.toUpperCase().includes(event.searchText.currentValue.toUpperCase()))
        this.data = copy.slice(0, this.pageSize)
      }else{
        this.spinner = true
        this.getCharacters(50);
      }
    }
    if(event.toDelete){
      event.toDelete.currentValue
      var arr = this.favorites
      var newData: any[] = arr.filter(x => x.id !=event.toDelete.currentValue)
      if(!newData) newData = []
      this.favorites = newData
      this.addFavorite()
    }
  }

  sliceData(event?:PageEvent){
    var index = event.pageIndex === 0 ? 1 : event.pageIndex + 1;
    this.data = this.characters.slice((event.pageIndex) * event.pageSize, event.pageSize * index)
  }
  onChangePageSize(event: String){
    console.log(event)
  }

  onClickComic(uri){
    this.modalRef = this.modalService.show(ModalComponent,{
      data:
      {
        resourceUri: uri,
        favorites: this.favorites
      }
    })
    this.modalRef.content.action.subscribe( (result: any) => { 
      this.favorites = result
      this.addFavorite()
    });
  }

  handleSelect(event){
    if(event.target.value == 1){
      this.characters = this.characters.sort(function(a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
    }else if(event.target.value == 2){
      this.characters = this.characters.sort(function(a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
      });
    }else if(event.target.value == 3){
      this.characters = this.characters.sort(function(a, b) {
        var textA = a.modified.toString().toUpperCase();
        var textB = b.modified.toString().toUpperCase();
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
      });
    }else{
      this.spinner = true
      this.getCharacters(50);
    }
    this.data = this.characters.slice(0, this.pageSize)
  }

}
