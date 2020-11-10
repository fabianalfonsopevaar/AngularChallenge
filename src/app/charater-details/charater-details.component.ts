import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import {environment} from '../../environments/environment'
import axios from 'axios';
import md5 from 'md5';
@Component({
  selector: 'app-charater-details',
  templateUrl:'./charater-details.component.html',
  styles: [
  ]
})
export class CharaterDetailsComponent implements OnInit {
  character: any;
  spinner: boolean=true;
  private routeSub: Subscription;
  panelOpenState: boolean;
  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.getCharacter(params['id'])
    });
  }

  getCharacter(id: number){
    axios.get(environment.endpoint+'/characters/'+id,{
      params: {
        "apikey": environment.publicKey,
        "ts": environment.ts,
        "hash": md5(environment.ts  + environment.privateKey + environment.publicKey)
    }})
    .then(response => {
        this.character = response.data.data.results[0]
        this.spinner = false
        console.log(this.character)
    })
    .catch(e => {
        this.spinner = false
        console.log(e.response)
    })
  }

}
