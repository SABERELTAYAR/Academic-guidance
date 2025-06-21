import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

interface CourseWarning {
  id: string;
  name: string;
  firstWarning: boolean;
  secondWarning: boolean;
}

interface Student {
  id: string;
  name: string;
  warnings: CourseWarning[];
}
@Component({
  selector: 'app-warnings',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './warnings.component.html',
  styleUrl: './warnings.component.css',
  standalone: true
})
export class WarningsComponent {
 students: Student[] = [
    {
      id: '2023001',
      name: 'أحمد محمد علي',
      warnings: [
        { id: '1', name: 'Enterprise Architecture', firstWarning: true, secondWarning: false },
        { id: '2', name: 'Network Forensics', firstWarning: false, secondWarning: false },
        { id: '3', name: 'Advanced Project Management', firstWarning: true, secondWarning: true },
        { id: '4', name: 'Network Programming', firstWarning: false, secondWarning: false },
        { id: '5', name: 'Advanced DataBase', firstWarning: false, secondWarning: false },
        { id: '6', name: 'Parallel Computing', firstWarning: true, secondWarning: false }
      ]
    },
    {
      id: '2023002',
      name: 'سعيد عبدالله أحمد',
      warnings: [
        { id: '1', name: 'Enterprise Architecture', firstWarning: false, secondWarning: false },
        { id: '2', name: 'Network Forensics', firstWarning: true, secondWarning: false },
        { id: '3', name: 'Advanced Project Management', firstWarning: false, secondWarning: false },
        { id: '4', name: 'Network Programming', firstWarning: true, secondWarning: true },
        { id: '5', name: 'Advanced DataBase', firstWarning: false, secondWarning: false },
        { id: '6', name: 'Parallel Computing', firstWarning: false, secondWarning: false }
      ]
    },
    {
      id: '2025001',
      name: 'فاطمة الزهراء محمود',
      warnings: [
        { id: '1', name: 'Enterprise Architecture', firstWarning: false, secondWarning: false },
        { id: '2', name: 'Network Forensics', firstWarning: false, secondWarning: false },
        { id: '3', name: 'Advanced Project Management', firstWarning: false, secondWarning: false },
        { id: '4', name: 'Network Programming', firstWarning: false, secondWarning: false },
        { id: '5', name: 'Advanced DataBase', firstWarning: true, secondWarning: false },
        { id: '6', name: 'Parallel Computing', firstWarning: false, secondWarning: false }
      ]
    }
  ];

   selectedStudentId: string = '';
  studentWarnings: CourseWarning[] = [];

  ngOnInit() {
    this.loadStudentFromLocalStorage();
  }

  loadStudentFromLocalStorage() {
    const studentID = localStorage.getItem('ID');
    if (studentID) {
      const matchedStudent = this.students.find(s => s.id === studentID);
      if (matchedStudent) {
        this.selectedStudentId = matchedStudent.id;
        this.studentWarnings = [...matchedStudent.warnings];
        return;
      }
    }
    // Default to first student if no match found
    this.selectedStudentId = this.students[0].id;
    this.studentWarnings = [...this.students[0].warnings];
  }

  getCurrentStudentName(): string {
    const student = this.students.find(s => s.id === this.selectedStudentId);
    return student?.name || 'غير محدد';
  }

  toggleWarning(course: CourseWarning, warningType: 'firstWarning' | 'secondWarning') {
    course[warningType] = !course[warningType];
    this.updateStudentWarnings();
  }

  resetWarnings(course: CourseWarning) {
    course.firstWarning = false;
    course.secondWarning = false;
    this.updateStudentWarnings();
  }

  private updateStudentWarnings() {
    const student = this.students.find(s => s.id === this.selectedStudentId);
    if (student) {
      student.warnings = [...this.studentWarnings];
    }
  }
}