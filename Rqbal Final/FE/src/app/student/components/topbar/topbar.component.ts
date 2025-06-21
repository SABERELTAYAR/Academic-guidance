import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router} from '@angular/router';

@Component({
  selector: 'app-topbar',
    imports: [
        NgOptimizedImage
    ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
