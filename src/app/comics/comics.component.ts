import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comics',
  templateUrl: './comics.component.html',
  styles: [
  ]
})
export class ComicsComponent implements OnInit {
  arr = [];
  @Input() favs: [];
  @Output() deleteEvent = new EventEmitter<number>();

  constructor() {
    
  }

  ngOnInit(): void {
  }

  ngOnChanges(event){
    this.arr = event.favs.currentValue
  }

  removeComic(id){
      this.deleteEvent.emit(id);
  }
}
