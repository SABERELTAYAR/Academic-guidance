import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../Services/api.service';
import { HttpClient } from '@angular/common/http';

 
@Component({
  selector: 'app-student-result',
  standalone :true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './student-result.component.html',
  styleUrl: './student-result.component.css'
})
export class StudentResultComponent {

  @Output() studentSelected = new EventEmitter<any>();

  users: any[] = [];
  loading =false;
  error :string | null = null;

  
  constructor(private fb: FormBuilder, private api: ApiService,private http: HttpClient) {
    this.filterForm = this.fb.group({
      admissionYear: [''],
      enrollmentDuration: [''],
      nameOrNumber: ['']
    });
  }
 filterForm: FormGroup;
  admissionYears = [ '2023', '2024', '2025'];
  enrollmentDurations = ['1 سنة', '2 سنة', '3 سنة', '4 سنة'];

 students = [
  { 
    name: 'سعيد عبدالله أحمد', 
    ID: '1', 
    admissionYear: '2023', 
    enrollmentDuration: '3 سنة',
    courses: [
      {
        code: 'CS301',
        hours: 3,
        name: 'هياكل البيانات',
        grades: { midterm: 15, oral: 8, classwork: 18, final: 45 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 86,
        grade: 'A',
        points: 3.7,
        controlTotal: 45
      },
      {
        code: 'CS302',
        hours: 3,
        name: 'قواعد البيانات',
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
    ID: '2', 
    admissionYear: '2023', 
    enrollmentDuration: '4 سنة',
    courses: [
      {
        code: 'CS401',
        hours: 3,
        name: 'تعلم الآلة',
        grades: { midterm: 18, oral: 9, classwork: 20, final: 48 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 95,
        grade: 'A+',
        points: 4.0,
        controlTotal: 48
      },
      {
        code: 'CS402',
        hours: 3,
        name: 'أمن المعلومات',
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
    ID: '3', 
    admissionYear: '2025', 
    enrollmentDuration: '4 سنة',
    courses: [
      {
        code: 'CS401',
        hours: 3,
        name: 'تعلم الآلة',
        grades: { midterm: 17, oral: 8, classwork: 19, final: 46 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 90,
        grade: 'A',
        points: 3.7,
        controlTotal: 46
      },
      {
        code: 'CS403',
        hours: 3,
        name: 'الواقع الافتراضي',
        grades: { midterm: 16, oral: 8, classwork: 18, final: 44 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 86,
        grade: 'A',
        points: 3.7,
        controlTotal: 44
      }
    ]
  },
  { 
    name: 'ياسمين حسن عبدالعزيز', 
    ID: '4', 
    admissionYear: '2024', 
    enrollmentDuration: '4 سنة',
    courses: [
      {
        code: 'CS301',
        hours: 3,
        name: 'الذكاء الاصطناعي',
        grades: { midterm: 19, oral: 9, classwork: 20, final: 49 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 97,
        grade: 'A+',
        points: 4.0,
        controlTotal: 49
      },
      {
        code: 'CS303',
        hours: 3,
        name: 'أنظمة التشغيل',
        grades: { midterm: 15, oral: 7, classwork: 17, final: 43 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 82,
        grade: 'B+',
        points: 3.3,
        controlTotal: 43
      }
    ]
  },
  { 
    name: 'آية محمود عبد الله', 
    ID: '5', 
    admissionYear: '2023', 
    enrollmentDuration: '4 سنة',
    courses: [
      {
        code: 'CS201',
        hours: 3,
        name: 'هياكل البيانات',
        grades: { midterm: 14, oral: 7, classwork: 16, final: 41 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 78,
        grade: 'B',
        points: 3.0,
        controlTotal: 41
      },
      {
        code: 'CS203',
        hours: 3,
        name: 'الرياضيات المتقدمة',
        grades: { midterm: 13, oral: 6, classwork: 15, final: 39 },
        maxGrades: { midterm: 20, oral: 10, classwork: 20, final: 50 },
        total: 73,
        grade: 'B',
        points: 3.0,
        controlTotal: 39
      }
    ]
  }
];

  filteredStudents = [...this.students];
  selectedStudent: any = null;
  studentCourses: any[] = [];



  ngOnInit() {
    this.filterForm.valueChanges.subscribe(values => {
      this.filterStudents(values);
    });
    this.fetchData();
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

  selectStudent(student: any) {
    this.selectedStudent = student;
    this.studentCourses = student.courses || [];
    this.studentSelected.emit(student);
  }

  calculateGPA(): number {
    if (!this.selectedStudent?.courses?.length) return 0;
    
    const totalPoints = this.selectedStudent.courses.reduce((sum: number, course: any) => {
      return sum + (course.points * course.hours);
    }, 0);
    
    const totalHours = this.selectedStudent.courses.reduce((sum: number, course: any) => {
      return sum + course.hours;
    }, 0);
    
    return totalPoints / totalHours;
  }

fetchData(){
  this.loading=true;
  this.error=null;

  this.api.getStudents().subscribe({
    next:(res)=>{
      this.users = res;
      this.loading=false;
      console.log(this.users);
    },
    error:(err)=>{
      this.error=err;
      this.loading=false;
    }
  })
}

}
