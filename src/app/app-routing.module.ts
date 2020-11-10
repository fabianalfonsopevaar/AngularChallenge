import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CharaterDetailsComponent} from '../app/charater-details/charater-details.component'
import {ContainerComponent} from '../app/container/container.component'

const routes: Routes = [
  {path: '', component: ContainerComponent},
  {path: 'details/:id', component: CharaterDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
