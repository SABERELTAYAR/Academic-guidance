// student-data.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Student, StudentService } from '../student.service';
import { StudentDataNavComponent } from "../student-data-nav/student-data-nav.component";
import { StudentLeftSidebarComponent } from '../student-left-sidebar/student-left-sidebar.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-data',
  standalone: true,
  imports: [StudentDataNavComponent, StudentLeftSidebarComponent, FormsModule, CommonModule ,ReactiveFormsModule,RouterModule],
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.css']
})
export class StudentDataComponent {
  @Output() studentUpdated = new EventEmitter<void>();

  @Input() selectStudent: Student = {
    // Personal Information
    arabicName: '',
    englishName: '',
    username: '',
    studentCode: '',
    nationalityCountry: '',
    gender: '',
    religion: '',
    birthDate: '',
    birthPlace: '',
    idType: '',
    maritalStatus: '',
    rfidNumber: '',
    financialSource: '',
    accountDisabled: '',
    notes: '',
    issueDate: '',
    issuePlace: '',
    secondNationality: '',
    feesNationality: '',
    specialNeedsType: '',
    
    // Family Information
    fatherName: '',
    fatherJob: '',
    motherName: '',
    motherJob: '',
    relationDegree: '',
    familyCity: '',
    familyAddress: '',
    familyNationality: '',
    homePhone: '',
    feeReductionReason: '',
    parentPhone: '',
    faxNumber: '',
    siblingsCount: 0,
    
    // Education Information
    schoolNameArabic: '',
    schoolNameEnglish: '',
    qualificationType: '',
    graduationYear: '',
    qualificationRound: '',
    qualificationScore: '',
    sat1Score: '',
    seatNumber: '',
    transferApprovalNumber: '',
    admissionType: '',
    certificateNumber: '',
    computerSerialReport: '',
    secondLanguage: '',
    percentage: '',
    qualificationDate: '',
    sat2Score: '',
    transferApprovalDate: '',
    transferredFrom: '',
    admissionYear: '',
    schoolAddress: '',
    
    // Academic Information
    faculty: '',
    enrollmentYear: '',
    program: '',
    level: '',
    gpa: '',
    creditHours: '',
    previousYearGPA: '',
    previousYearGrade: '',
    lastCardPrint: '',
    graduationProjectAr: '',
    graduationProjectEn: '',
    courses: [],
    
    // Additional fields
    ID: '',
    nationality: '',
    universityID: '',
    enrollmentDuration: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    height: '',
    weight: '',
    bloodType: '',
    disabilityStatus: '',
    chronicDiseases: '',
    lastMedicalCheckup: '',
    literacyStatus: '',
    literacyExemptionReason: '',
    literacyCenter: '',
    literacyCertificationYear: ''
  };

  isEditing: boolean = false;
  originalStudent: Student = {...this.selectStudent};

  constructor(private studentService: StudentService ,  private router: Router // Add Router injection
) {}

  // Toggle between edit and view modes
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      // Save original data when entering edit mode
      this.originalStudent = {...this.selectStudent};
    }
  }

  // Save changes to the student data
  saveChanges(): void {
    if (this.selectStudent) {
      this.studentService.updateStudent(this.selectStudent);
      this.isEditing = false;

    this.router.navigate(['/admin/student-data-main']); // Adjust the route as needed

    }
  }

  // Cancel editing and revert changes
  cancelEdit(): void {
    this.isEditing = false;
    this.selectStudent = {...this.originalStudent};
  }

  // Print the form
  printForm(): void {
    window.print();
  }

  // Handle when a student is selected from the sidebar
  onStudentSelected(student: Student): void {
    this.selectStudent = student;
    this.isEditing = false;
  }

  // Refresh the student list (if needed)
  refreshStudentList(): void {
    // Implementation depends on your service
  }

  // Add a new course
  onCourseAdded(): void {
    if (!this.selectStudent.courses) {
      this.selectStudent.courses = [];
    }
    this.selectStudent.courses.push({
      code: '',
      name: '',
      hours: 0,
      instructor: ''
    });
  }

  // Remove a course
  onCourseRemoved(index: number): void {
    if (this.selectStudent.courses) {
      this.selectStudent.courses.splice(index, 1);
    }
  }
}