import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePasswordService } from './Service/change-password.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-change-password',
   imports: [CommonModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
passwordForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showOldPassword: boolean = false;
showNewPassword: boolean = false;
showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private passwordService: ChangePasswordService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      new_password2: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const new_password2 = control.get('new_password2');

    if (newPassword?.value !== new_password2?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  get oldPassword() {
    return this.passwordForm.get('oldPassword')!;
  }

  get newPassword() {
    return this.passwordForm.get('newPassword')!;
  }

  get new_password2() {
    return this.passwordForm.get('new_password2')!;
  }

onSubmit() {
  if (this.passwordForm.invalid) {
    return;
  }

  this.isLoading = true;
  this.successMessage = null;
  this.errorMessage = null;

  const passwordData = {
    old_password: this.passwordForm.value.oldPassword,
    new_password: this.passwordForm.value.newPassword,
    new_password2: this.passwordForm.value.new_password2
  };

  this.passwordService.changePassword(passwordData).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.successMessage = 'Password changed successfully!';
      this.passwordForm.reset();
      
      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 2000);
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = error.error?.message || 
                        error.error?.error ||
                        'Failed to change password. Please try again.';
    }
  });
}
}