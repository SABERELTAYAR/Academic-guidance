import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FootAdminComponent } from "../foot-admin/foot-admin.component";

@Component({
  selector: 'app-academic-registration',
  imports: [CommonModule, RouterLink, FootAdminComponent],
  templateUrl: './academic-registration.component.html',
  styleUrl: './academic-registration.component.css'
})
export class AcademicRegistrationComponent {
  constructor(private router: Router) {}
 navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
