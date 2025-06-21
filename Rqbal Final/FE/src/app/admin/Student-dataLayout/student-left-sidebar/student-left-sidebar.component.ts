// student-left-sidebar.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Student, StudentService } from '../student.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-left-sidebar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-left-sidebar.component.html',
  styleUrls: ['./student-left-sidebar.component.css']
})
export class StudentLeftSidebarComponent implements OnInit {
  @Output() studentSelected = new EventEmitter<Student>();

  filterForm: FormGroup;
  admissionYears = [ '2023', '2024', '2025'];
  enrollmentDurations = ['1 سنة', '2 سنة', '3 سنة', '4 سنة'];

  students: Student[] = [];
  filteredStudents: Student[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  totalCount = 0;
  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private studentService: StudentService) {
    this.filterForm = this.fb.group({
      admissionYear: [''],
      enrollmentDuration: [''],
      nameOrNumber: ['']
    });
  }

  ngOnInit() {
     this.loadStudents();
    
    // Subscribe to student updates
 this.subscription.add(
      this.studentService.getStudentsObservable().subscribe(students => {
        this.students = students;
        this.filterStudents(this.filterForm.value); // Reapply filters
        this.totalCount = this.students.length;
      })
    );
    
   this.subscription.add(
      this.filterForm.valueChanges.subscribe(values => {
        this.filterStudents(values);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // Clean up subscriptions
  }
  
 loadStudents(): void {
  this.isLoading = true;
  this.errorMessage = null;

 this.studentService.getStudentsObservable().subscribe({
    next: (students) => {
      this.students = students;
      this.filteredStudents = [...this.students];
      this.totalCount = this.students.length;
      this.isLoading = false;
    },
    error: (error) => {
      this.errorMessage = 'Failed to load students';
      this.isLoading = false;
    }
  });
}

  filterStudents(filters: any): void {
    if (!this.students) return;

    this.filteredStudents = this.students.filter(student => {
      const matchesYear = !filters.admissionYear || 
                         student.admissionYear === filters.admissionYear;
      
      const matchesDuration = !filters.enrollmentDuration || 
                           student.enrollmentDuration === filters.enrollmentDuration;
      
      const matchesNameOrNumber = !filters.nameOrNumber ||
                                student.arabicName.includes(filters.nameOrNumber) ||
                                student.ID.includes(filters.nameOrNumber) ||
                                student.studentCode.includes(filters.nameOrNumber);
      
      return matchesYear && matchesDuration && matchesNameOrNumber;
    });
  }

  selectStudent(student: Student): void {
    this.studentSelected.emit(student);
    // Optional: Highlight selected student in the list
    this.filteredStudents = this.filteredStudents.map(s => {
      return {...s, isSelected: s.ID === student.ID};
    });
  }
}