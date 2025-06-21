import { Component } from '@angular/core';
import { FootAdminComponent } from "../../foot-admin/foot-admin.component";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-data-main',
  imports: [FootAdminComponent,RouterLink],
  templateUrl: './student-data-main.component.html',
  styleUrl: './student-data-main.component.css'
})
export class StudentDataMainComponent {
    constructor(private router: Router) {}
 navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
