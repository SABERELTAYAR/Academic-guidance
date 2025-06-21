import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-student-data-nav',
  imports: [],
  templateUrl: './student-data-nav.component.html',
  styleUrl: './student-data-nav.component.css'
})
export class StudentDataNavComponent {
 activeSection: string = 'personal-info'; // Track active section

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  showSection(section: string) {
     document.getElementById(this.activeSection)?.classList.remove('active');
    this.activeSection = section; // Update active section
 
    // If you still need to scroll to section
    const element = document.getElementById(section);
    element?.classList.add('active');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
