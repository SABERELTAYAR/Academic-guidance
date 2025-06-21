import { Component } from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

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

  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout(): void {
    // Clear all authentication-related data
    localStorage.removeItem('token');
    
    
    
    // Redirect to login page
    this.router.navigate(['/login']);
    
    // Optional: Force a full page reload to clear any state
  }
}
