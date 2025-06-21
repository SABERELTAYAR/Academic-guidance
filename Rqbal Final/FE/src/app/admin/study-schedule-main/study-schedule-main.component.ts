import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FootAdminComponent } from "../foot-admin/foot-admin.component";

@Component({
  selector: 'app-study-schedule-main',
  imports: [CommonModule, RouterLink, FootAdminComponent],
  templateUrl: './study-schedule-main.component.html',
  styleUrl: './study-schedule-main.component.css'
})
export class StudyScheduleMainComponent {
    constructor(private router: Router) {}
 navigateTo(route: string) {
    this.router.navigate([route]);
  }


}
