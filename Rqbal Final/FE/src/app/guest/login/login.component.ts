import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      // Mark all fields as touched to show validation messages
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        const role = response.role || this.authService.getUserRole();
        
        switch(role) {
          case 'academic_admin':
            this.router.navigate(['/admin']);
            break;
          default:
            // Set user ID based on username
            if (username === 'ahmed') {
              localStorage.setItem("ID", "2023001");
            } else if (username === 'saeed') {
              localStorage.setItem("ID", "2023002");
            } else if (username === 'fatma') {
              localStorage.setItem("ID", "2025001");
            } else {
              localStorage.setItem("ID", "2023001");
            }
            this.router.navigate(['/students']);
            break;
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        } else if (error.status === 0) {
          this.errorMessage = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت';
        } else {
          this.errorMessage = 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى';
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}