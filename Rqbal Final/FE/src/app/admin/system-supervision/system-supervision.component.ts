import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FootAdminComponent } from "../foot-admin/foot-admin.component";
@Component({
  selector: 'app-system-supervision',
  imports: [CommonModule, RouterLink, FootAdminComponent],
  templateUrl: './system-supervision.component.html',
  styleUrl: './system-supervision.component.css'
})
export class SystemSupervisionComponent {
   constructor(private router: Router) {}
 navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
