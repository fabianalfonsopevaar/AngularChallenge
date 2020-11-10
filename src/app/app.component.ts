import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit{
  title = 'angular-challenge';
  favorites = [];
  ngOnInit(): void {
    localStorage.setItem('favoriteComics', JSON.stringify(this.favorites))
  }
  
}
