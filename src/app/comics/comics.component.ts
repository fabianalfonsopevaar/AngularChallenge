import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private toastr: ToastrService) {
    
  }

  ngOnInit(): void {
  }

  ngOnChanges(event){
    this.arr = event.favs.currentValue
  }

  removeComic(id){
      this.deleteEvent.emit(id);
      this.toastr.error('This comic was removed from favorites', 'Removed');
  }
}
