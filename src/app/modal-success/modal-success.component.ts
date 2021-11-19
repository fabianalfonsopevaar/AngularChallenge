import { Component } from '@angular/core';
import { MDBModalRef } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styles: [
  ]
})
export class ModalSuccessComponent   {

  succeeded: Boolean

  constructor(public modalRef: MDBModalRef) {}


}
