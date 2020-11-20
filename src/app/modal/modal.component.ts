import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import axios from 'axios';
import md5 from 'md5';
import {environment} from '../../environments/environment'
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styles: [
  ]
})
export class ModalComponent implements OnInit {

  action: Subject<any> = new Subject();

  resourceUri: string;
  favorites = [] as any;
  comic: any;
  spinner: boolean;  
  favorite: boolean;  
  constructor(public modalRef: MDBModalRef,private toastr: ToastrService) {
    this.spinner = true;
    this.favorite = false;  
  }

  ngOnInit(): void {
    this.getComic()
  }

  getComic(){
    axios.get(this.resourceUri,{
      params: {
        "apikey": environment.publicKey,
        "ts": environment.ts,
        "hash": md5(environment.ts  + environment.privateKey + environment.publicKey)
    }})
    .then(response => {
        this.comic = response.data.data.results[0]
        this.spinner = false
        this.favorite = this.checkIfFavourite(this.comic.id)
    })
    .catch(e => {
        this.spinner = false
        console.log(e.response)
    })
  }

  addToFavourite(){
    if(!this.checkIfFavourite(this.comic.id)){
      var arr = this.favorites
      var newData = [...arr, this.comic]
      this.favorites = newData
      this.toastr.success('This comic was added to favorites', 'Added');
    }else{
      var arr = this.favorites
      var newData: any[] = arr.filter(x => x.id !=this.comic.id)
      if(!newData) newData = []
      this.favorites = newData
      this.toastr.error('This comic was removed from favorites', 'Removed');
    }
    this.favorite = this.checkIfFavourite(this.comic.id)
    this.action.next(this.favorites);
  }

  checkIfFavourite(pId: number){
    var arr = this.favorites
    var exist = arr.find(x => x.id == pId)
    if(exist) return true
    return false
  }

}
