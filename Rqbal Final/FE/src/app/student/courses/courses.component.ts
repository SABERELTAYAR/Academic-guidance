import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
interface StudentCourse {
  id: number;
  course: number;
  course_title: string;
  course_code: string;
  credit_hours: number;
  department: string;
  semester: string;
  year: string;
  grade: string;
  status: string;
  status_display: string;
  enrollment_date: string;
  last_updated: string;
  notes: string;
}
@Component({
  selector: 'app-courses',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
loading: boolean = true;
  error: string | null = null;
  studentCourses: StudentCourse[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStudentCourses();
  }
private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  fetchStudentCourses(): void {
    this.loading = true;
    this.error = null;
     const headers = this.getAuthHeaders();
    this.http.get<StudentCourse[]>(environment.apiUrl + '/accounts/student/enrollments/', { headers })
      .pipe(
        catchError(error => {
          this.error = 'حدث خطأ أثناء جلب بيانات المقررات';
          this.loading = false;
          return throwError(error);
        })
      )
      .subscribe(
        (data: StudentCourse[]) => {
          this.studentCourses = data;
          this.loading = false;
        }
      );
  }
  get activeCourses() {
  return this.studentCourses?.filter(c => c.status_display === 'نشط') || [];
}

get completedCourses() {
  return this.studentCourses?.filter(c => c.status_display === 'مكتمل') || [];
}
}