import { Component, OnInit, Input } from '@angular/core';



@Component({
  selector: 'app-container',
  templateUrl:'./container.component.html',
  styles: [
  ]
})
export class ContainerComponent implements OnInit {
  @Input() inpText: string; // decorate the property with @Input()
  favorites = [] as any;
  delete: number;
  characterId: any;
  searchText: string;

  constructor() { }

  ngOnInit(): void {

  }

  addFavorite(event) {
    this.favorites = event
  }
  delEvent(event){
    this.delete = event
  }
  outText(event){
    this.inpText = event;
  }
}
