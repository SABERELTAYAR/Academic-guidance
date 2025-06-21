import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FootAdminComponent } from '../foot-admin/foot-admin.component';
interface Course {
  code: string;
  name: string;
  type: string;
  hours: number;
  failures: number;
  semester: string;
  lecture: string;
  lectureType: string;
  day: string;
  startTime: string;
  endTime: string;
  group: string;
  availableSeats: number;
  grades?: any;
  maxGrades?: any;
  total?: number;
  grade?: string;
  points?: number;
  controlTotal?: number;
}

interface Student {
  name: string;
  ID: string;
  admissionYear: string;
  enrollmentDuration: string;
  level: string;
  allowedHours: number;
  earnedHours: number;
  GPA: number;
  allowedCourses: number;
  extraHours: number;
  registeredHours: number;
  courses: Course[];
}
@Component({
  selector: 'app-student-schedule',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-schedule.component.html',
  styleUrl: './student-schedule.component.css'
})

export class StudentScheduleComponent {
  @Output() studentSelected = new EventEmitter<Student>();
  
  // Data properties
  students = [
  { 
    name: 'سعيد عبدالله أحمد',
    ID: '2023001',
    admissionYear: '2023',
    enrollmentDuration: '3 سنة',
    level: 'الثالث',
    allowedHours: 18,
    earnedHours: 45,
    GPA: 3.5,
    allowedCourses: 6,
    extraHours: 2,
    registeredHours: 15,
    courses: [
      {
        code: 'CS301',
        name: 'هياكل البيانات',
        type: 'إجباري',
        hours: 3,
        failures: 0,
        semester: 'الخريف 2023',
        lecture: 'CS301-01',
        lectureType: 'محاضرة',
        day: 'الأحد',
        startTime: '08:00',
        endTime: '10:00',
        group: 'A',
        availableSeats: 5,
        grades: { midterm: 15, oral: 8, classwork: 18, final: 45 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 86,
        grade: 'A',
        points: 3.7,
        controlTotal: 45
      },
      {
        code: 'CS302',
        name: 'قواعد البيانات',
        type: 'إجباري',
        hours: 3,
        failures: 0,
        semester: 'الخريف 2023',
        lecture: 'CS302-02',
        lectureType: 'عملي',
        day: 'الثلاثاء',
        startTime: '10:00',
        endTime: '12:00',
        group: 'B',
        availableSeats: 3,
        grades: { midterm: 12, oral: 9, classwork: 15, final: 38 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 74,
        grade: 'B+',
        points: 3.3,
        controlTotal: 38
      }
    ]
  },
  { 
    name: 'أحمد محمد علي',
    ID: '2023002',
    admissionYear: '2023',
    enrollmentDuration: '4 سنة',
    level: 'الرابع',
    allowedHours: 18,
    earnedHours: 60,
    GPA: 3.8,
    allowedCourses: 6,
    extraHours: 0,
    registeredHours: 18,
    courses: [
      {
        code: 'CS401',
        name: 'تعلم الآلة',
        type: 'اختياري',
        hours: 3,
        failures: 0,
        semester: 'الربيع 2024',
        lecture: 'CS401-01',
        lectureType: 'محاضرة',
        day: 'الإثنين',
        startTime: '09:00',
        endTime: '11:00',
        group: 'A',
        availableSeats: 2,
        grades: { midterm: 18, oral: 9, classwork: 20, final: 48 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 95,
        grade: 'A+',
        points: 4.0,
        controlTotal: 48
      },
      {
        code: 'CS402',
        name: 'أمن المعلومات',
        type: 'إجباري',
        hours: 3,
        failures: 0,
        semester: 'الربيع 2024',
        lecture: 'CS402-03',
        lectureType: 'عملي',
        day: 'الأربعاء',
        startTime: '13:00',
        endTime: '15:00',
        group: 'C',
        availableSeats: 7,
        grades: { midterm: 14, oral: 7, classwork: 16, final: 42 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 79,
        grade: 'B+',
        points: 3.3,
        controlTotal: 42
      }
    ]
  },
  { 
    name: 'فاطمة الزهراء محمود',
    ID: '2025001',
    admissionYear: '2023',
    enrollmentDuration: '3 سنة',
    level: 'الأول',
    allowedHours: 15,
    earnedHours: 0,
    GPA: 0.0,
    allowedCourses: 5,
    extraHours: 0,
    registeredHours: 12,
    courses: [
      {
        code: 'CS101',
        name: 'مقدمة في البرمجة',
        type: 'إجباري',
        hours: 3,
        failures: 0,
        semester: 'الخريف 2025',
        lecture: 'CS101-01',
        lectureType: 'محاضرة',
        day: 'السبت',
        startTime: '08:00',
        endTime: '10:00',
        group: 'A',
        availableSeats: 10,
        grades: { midterm: 0, oral: 0, classwork: 0, final: 0 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 0,
        grade: '-',
        points: 0.0,
        controlTotal: 0
      },
      {
        code: 'MATH101',
        name: 'رياضيات هندسية',
        type: 'إجباري',
        hours: 3,
        failures: 0,
        semester: 'الخريف 2025',
        lecture: 'MATH101-02',
        lectureType: 'محاضرة',
        day: 'الأحد',
        startTime: '10:00',
        endTime: '12:00',
        group: 'B',
        availableSeats: 8,
        grades: { midterm: 0, oral: 0, classwork: 0, final: 0 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 0,
        grade: '-',
        points: 0.0,
        controlTotal: 0
      }
    ]
  }
]; // Keep your existing student data here
  filteredStudents: Student[] = [...this.students];
  selectedStudent: Student | null = null;
  studentCourses: Course[] = [];
  
  showCourseModal = false;
  isEditingCourse = false;
  currentCourseId: string | null = null;
  loading = false;
  error: string | null = null;
  
  filterForm: FormGroup;
  courseForm: FormGroup;
  
  admissionYears = ['2023', '2024', '2025'];
  enrollmentDurations = ['1 سنة', '2 سنة', '3 سنة', '4 سنة'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.filterForm = this.fb.group({
      admissionYear: [''],
      enrollmentDuration: [''],
      nameOrNumber: ['']
    });

    this.courseForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      type: ['إجباري', Validators.required],
      hours: [3, [Validators.required, Validators.min(1)]],
      failures: [0, [Validators.required, Validators.min(0)]],
      semester: ['', Validators.required],
      lecture: ['', Validators.required],
      lectureType: ['محاضرة', Validators.required],
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      group: ['', Validators.required],
      availableSeats: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges.subscribe(values => {
      this.filterStudents(values);
    });
  }

  filterStudents(filters: any) {
    this.filteredStudents = this.students.filter(student => {
      const matchesYear = !filters.admissionYear || student.admissionYear === filters.admissionYear;
      const matchesDuration = !filters.enrollmentDuration || student.enrollmentDuration === filters.enrollmentDuration;
      const matchesNameOrNumber = !filters.nameOrNumber ||
        student.name.includes(filters.nameOrNumber) ||
        student.ID.includes(filters.nameOrNumber);
      return matchesYear && matchesDuration && matchesNameOrNumber;
    });
  }

  selectStudent(student: Student) {
    this.selectedStudent = student;
    this.studentCourses = [...student.courses];
    this.studentSelected.emit(student);
  }

  openAddCourseModal() {
    this.isEditingCourse = false;
    this.currentCourseId = null;
    this.courseForm.reset({
      type: 'إجباري',
      hours: 3,
      failures: 0,
      availableSeats: 0,
      lectureType: 'محاضرة'
    });
    this.showCourseModal = true;
  }

  editCourse(course: Course) {
    this.isEditingCourse = true;
    this.currentCourseId = course.code;
    this.courseForm.patchValue(course);
    this.showCourseModal = true;
  }

  saveCourse() {
    if (this.courseForm.invalid) {
      this.error = 'الرجاء تعبئة جميع الحقول المطلوبة';
      return;
    }

    const courseData: Course = this.courseForm.value;

    if (this.isEditingCourse && this.currentCourseId) {
      const index = this.studentCourses.findIndex(c => c.code === this.currentCourseId);
      if (index !== -1) {
        this.studentCourses[index] = { ...courseData };
      }
    } else {
      this.studentCourses.push({ ...courseData });
    }

    if (this.selectedStudent) {
      this.selectedStudent.courses = [...this.studentCourses];
    }

    this.closeModal();
  }

  deleteCourse(course: Course) {
    if (confirm(`هل أنت متأكد من حذف المقرر ${course.name}؟`)) {
      this.studentCourses = this.studentCourses.filter(c => c.code !== course.code);
      
      if (this.selectedStudent) {
        this.selectedStudent.courses = [...this.studentCourses];
      }
    }
  }

  closeModal() {
    this.showCourseModal = false;
    this.error = null;
    this.courseForm.reset();
  }
}