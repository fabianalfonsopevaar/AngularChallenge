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
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContainerComponent,
    CharactersComponent,
    ModalComponent,
    ComicsComponent,
    CharaterDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatExpansionModule,
    MDBBootstrapModulesPro.forRoot(),
    FormsModule
  ],
  entryComponents: [ ModalComponent ],
  providers: [MDBSpinningPreloader],
  bootstrap: [AppComponent]
})
export class AppModule { }
