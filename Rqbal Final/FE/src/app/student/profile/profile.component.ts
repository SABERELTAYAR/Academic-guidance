import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileServiceService } from './service/profile-service.service';
interface Profile {
  id: number;
  full_name: string;
  home_phone: string | null;
  mobile: string | null;
  email: string | null;
  role: string;
  program: string | null;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  phone_number: string | null;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  profile: Profile;
}

@Component({
  selector: 'app-profile',
     imports: [CommonModule,ReactiveFormsModule,FormsModule ],
   
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userProfile: UserProfile | null = null;
  loading: boolean = true;
  error: string | null = null;



  constructor(private profileService: ProfileServiceService) { }

ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;

    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.userProfile = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'حدث خطأ أثناء تحميل البيانات الشخصية';
        console.error('Error loading profile:', err);
        this.loading = false;
      }
    });
  }
}