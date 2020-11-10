import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();
  searchText: string;
  constructor() { }

  ngOnInit(): void {
  }

  outText(){
    this.newItemEvent.emit(this.searchText);
  }

}
