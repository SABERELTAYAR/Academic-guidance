import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FootAdminComponent } from "../foot-admin/foot-admin.component";

@Component({
  selector: 'app-control-main',
  imports: [CommonModule, RouterLink, FootAdminComponent],
  templateUrl: './control-main.component.html',
  styleUrl: './control-main.component.css'
})
export class ControlMainComponent {
    constructor(private router: Router) {}

navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
