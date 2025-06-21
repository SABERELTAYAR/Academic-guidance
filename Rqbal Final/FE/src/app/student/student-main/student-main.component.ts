import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-main',
  imports: [],
  templateUrl: './student-main.component.html',
  styleUrl: './student-main.component.css'
})
export class StudentMainComponent {
    constructor(private router: Router) {}
  
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
