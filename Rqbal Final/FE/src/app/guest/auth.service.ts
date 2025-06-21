import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

interface RegisterData {
  username: string;
  password: string;
  password2:string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl; // or your API endpoint

  constructor(private http: HttpClient) {
    // Check if token exists in localStorage on initialization
  }

login(username: string, password: string): Observable<any> {
  const body = {
    username: username.trim(),  // Trim whitespace
    password: password
  };

  return this.http.post(`${this.apiUrl}/accounts/login/`, body, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).pipe(
    tap((response: any) => {
      if (response.access) { 
        debugger
        localStorage.setItem('token', response.access);
        localStorage.setItem('user_role', response.user.profile.role);
      }
    }),
    catchError(error => {
      console.error('Login error:', error);
      return throwError(() => ({
        message: error.error?.error || 'Login failed. Please try again.'
      }));
    })
  );
}

register(userData: RegisterData): Observable<any> {
  return this.http.post(`${this.apiUrl}/accounts/register/`, userData, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).pipe(
    tap((response: any) => {
      // Handle successful registration response
      if (response.access) {
        localStorage.setItem('token', response.access);
        
        // Store user role if available (adjust according to your API response)
        if (response.user?.profile?.role) {
          localStorage.setItem('user_role', response.user.profile.role);
        }
      }
    }),
    catchError(error => {
      console.error('Registration error:', error);
      return throwError(() => ({
        message: this.getRegistrationErrorMessage(error),
        details: error.error?.details || null
      }));
    })
  );
}

private getRegistrationErrorMessage(error: any): string {
  if (error.error) {
    // Handle specific error cases
    if (error.error.username) {
      return 'اسم المستخدم هذا موجود بالفعل';
    }
    if (error.error.email) {
      return 'البريد الإلكتروني هذا مسجل بالفعل';
    }
    if (error.error.non_field_errors) {
      return error.error.non_field_errors.join(' ');
    }
    return error.error.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.';
  }
  return 'اتصال بالشبكة غير متوفر. يرجى التحقق من اتصالك بالإنترنت.';
}
getUserRole(): string | null {
  return localStorage.getItem('user_role');
}

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');}
}
