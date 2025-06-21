import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
 interface CourseResult {
  id: string;
  name: string;
  grade: string;
  hours: number;
}

 interface SemesterResult {
  id: string;
  name: string;
  courses: CourseResult[];
  earnedHours: number;
  gpa: number;
}

 interface StudentResults {
  id: string;
  name: string;
  academicYear: string;
  semesters: SemesterResult[];
  totalHours: number;
  cumulativeGPA: number;
}
@Component({
  selector: 'app-results',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
   studentsResults: StudentResults[] = [
  {
    id: '2023001',
    name: 'أحمد محمد علي',
    academicYear: 'الأولى',
    totalHours: 33,
    cumulativeGPA: 3.56,
    semesters: [
      {
        id: 'sem1',
        name: 'الترم الأول',
        earnedHours: 18,
        gpa: 3.54,
        courses: [
          { id: '101', name: 'Enterprise Architecture', grade: 'A+', hours: 3 },
          { id: '102', name: 'Network Forensics', grade: 'B+', hours: 3 },
          { id: '103', name: 'Advanced Project Management', grade: 'C+', hours: 3 },
          { id: '104', name: 'Network Programming', grade: 'A+', hours: 3 },
          { id: '105', name: 'Advanced DataBase', grade: 'A+', hours: 3 },
          { id: '106', name: 'Parallel Computing', grade: 'B', hours: 3 }
        ]
      },
      {
        id: 'sem2',
        name: 'الترم الثاني',
        earnedHours: 15,
        gpa: 3.54,
        courses: [
          { id: '201', name: 'Enterprise Architecture 2', grade: 'A', hours: 3 },
          { id: '202', name: 'Network Security', grade: 'B', hours: 3 },
          { id: '203', name: 'Software Engineering', grade: 'F', hours: 3 },
          { id: '204', name: 'Distributed Systems', grade: 'A+', hours: 3 },
          { id: '205', name: 'Data Mining', grade: 'A+', hours: 3 }
        ]
      }
    ]
  },
  {
    id: '2023002',
    name: 'سعيد عبدالله أحمد',
    academicYear: 'الثانية',
    totalHours: 60,
    cumulativeGPA: 3.22,
    semesters: [
      {
        id: 'sem1',
        name: 'الترم الأول',
        earnedHours: 18,
        gpa: 3.10,
        courses: [
          { id: '101', name: 'Enterprise Architecture', grade: 'B', hours: 3 },
          { id: '102', name: 'Network Forensics', grade: 'B+', hours: 3 },
          { id: '103', name: 'Advanced Project Management', grade: 'C', hours: 3 },
          { id: '104', name: 'Network Programming', grade: 'A', hours: 3 },
          { id: '105', name: 'Advanced DataBase', grade: 'B+', hours: 3 },
          { id: '106', name: 'Parallel Computing', grade: 'B', hours: 3 }
        ]
      },
      {
        id: 'sem2',
        name: 'الترم الثاني',
        earnedHours: 15,
        gpa: 3.34,
        courses: [
          { id: '201', name: 'Enterprise Architecture 2', grade: 'A-', hours: 3 },
          { id: '202', name: 'Network Security', grade: 'B+', hours: 3 },
          { id: '203', name: 'Software Engineering', grade: 'C+', hours: 3 },
          { id: '204', name: 'Distributed Systems', grade: 'A', hours: 3 },
          { id: '205', name: 'Data Mining', grade: 'A', hours: 3 }
        ]
      }
    ]
  },
  {
    id: '2025001',
    name: 'فاطمة الزهراء محمود',
    academicYear: 'الثالثة',
    totalHours: 90,
    cumulativeGPA: 3.78,
    semesters: [
      {
        id: 'sem1',
        name: 'الترم الأول',
        earnedHours: 18,
        gpa: 3.80,
        courses: [
          { id: '101', name: 'Enterprise Architecture', grade: 'A+', hours: 3 },
          { id: '102', name: 'Network Forensics', grade: 'A', hours: 3 },
          { id: '103', name: 'Advanced Project Management', grade: 'A-', hours: 3 },
          { id: '104', name: 'Network Programming', grade: 'A+', hours: 3 },
          { id: '105', name: 'Advanced DataBase', grade: 'A', hours: 3 },
          { id: '106', name: 'Parallel Computing', grade: 'A-', hours: 3 }
        ]
      },
      {
        id: 'sem2',
        name: 'الترم الثاني',
        earnedHours: 18,
        gpa: 3.76,
        courses: [
          { id: '201', name: 'Enterprise Architecture 2', grade: 'A', hours: 3 },
          { id: '202', name: 'Network Security', grade: 'A-', hours: 3 },
          { id: '203', name: 'Software Engineering', grade: 'A+', hours: 3 },
          { id: '204', name: 'Distributed Systems', grade: 'A', hours: 3 },
          { id: '205', name: 'Data Mining', grade: 'A+', hours: 3 },
          { id: '206', name: 'Cloud Computing', grade: 'A', hours: 3 }
        ]
      }
    ]
  }
];
 studentId: string | null = null;
  studentResults: StudentResults | null = null;
  loading: boolean = true;
  error: string | null = null;
  constructor(private router: Router) {}



  navigateTo(route: string) {
    this.router.navigate([route]);
  }


 

 
  ngOnInit(): void {
    this.loadStudentResults();
  }

 loadStudentResults(): void {
    this.loading = true;
    this.error = null;
    
    try {
      // Get student ID from localStorage
      this.studentId = localStorage.getItem('ID');
      
      if (!this.studentId) {
        throw new Error('Student ID not found in localStorage');
      }
      
      // Check if we have this student in our data
      const foundStudent = this.studentsResults.find(s => s.id === this.studentId);
      
      if (foundStudent) {
        this.studentResults = foundStudent;
        
        // Save to localStorage for future use
        localStorage.setItem(`studentResults_${this.studentId}`, JSON.stringify(foundStudent));
      } else {
        // Check localStorage for previously saved results
        const savedResults = localStorage.getItem(`studentResults_${this.studentId}`);
        
        if (savedResults) {
          this.studentResults = JSON.parse(savedResults);
        } else {
          throw new Error('No results found for this student');
        }
      }
    } catch (err) {
      this.error = 'حدث خطأ أثناء تحميل نتائج الطالب';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

navigateToDetails(): void {
    if (this.studentId) {
      this.router.navigate(['/students/result-details', this.studentId]);
    } else {
      this.error = 'لا يمكن عرض التفاصيل بدون معرف الطالب';
    }
  }
getGradeColor(grade: string): string {
    switch (grade) {
      case 'A+': return 'text-green-600';
      case 'A':
      case 'A-': return 'text-blue-600';
      case 'B+':
      case 'B': return 'text-yellow-600';
      case 'C+':
      case 'C': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }
}

