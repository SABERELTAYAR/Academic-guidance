import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-index',
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  constructor(private router: Router) {}



  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
