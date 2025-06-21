import { Component } from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';
@Component({
  selector: 'app-admin-sidebar',
  imports: [NgOptimizedImage,NgClass],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
logout() {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}
activeRoute = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.activeRoute = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = this.router.url;
      }
    });
  }

  isActive(route: string): string {
    
    if(this.activeRoute ===route){
      return 'bg-[#072d51]';
    }
    return '';
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}

