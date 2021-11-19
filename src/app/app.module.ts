import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContainerComponent } from './container/container.component';
import { CharactersComponent } from './characters/characters.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ModalComponent } from './modal/modal.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { ComicsComponent } from './comics/comics.component';
import { FormsModule } from '@angular/forms';
import { CharaterDetailsComponent } from './charater-details/charater-details.component';
import { CheckoutComponent } from './checkout/checkout.component'
import { ShoppingCartComponent } from './shoppingCart/shoppingCart.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ShoppingCartService } from './service/shoppingCart.service';
import { ModalSuccessComponent } from './modal-success/modal-success.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContainerComponent,
    CharactersComponent,
    ModalComponent,
    ComicsComponent,
    CharaterDetailsComponent,
    CheckoutComponent,
    ShoppingCartComponent,
    ModalSuccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatExpansionModule,
    MDBBootstrapModulesPro.forRoot(),
    FormsModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  entryComponents: [ ModalComponent, ModalSuccessComponent ],
  providers: [MDBSpinningPreloader, ShoppingCartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
