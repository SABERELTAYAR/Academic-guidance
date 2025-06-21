import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
    imports:[ReactiveFormsModule],
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required],
      user_type: ['student']
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('password2')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

  
    this.errorMessage = null;
    this.successMessage = null;

    const formData = this.registerForm.value;
    // Remove password2 as it's not needed in the backend
    const { ...registrationData } = formData;
debugger
    this.authService.register(registrationData).subscribe({
      
      next: (response) => {

        this.successMessage = 'تم التسجيل بنجاح! جاري توجيهك...';
        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {

        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  // Helper to get user-friendly error messages
  getErrorMessage(error: any): string {
    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      if (error.error.username) {
        return 'اسم المستخدم هذا مستخدم بالفعل';
      }
      if (error.error.email) {
        return 'البريد الإلكتروني هذا مستخدم بالفعل';
      }
      if (error.error.non_field_errors) {
        return error.error.non_field_errors.join(' ');
      }
    }
    return 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.';
  }

  // Helper to check if field has error
  hasError(field: string, errorType: string) {
    const control = this.registerForm.get(field);
    return control?.touched && control?.errors?.[errorType];
  }
}
