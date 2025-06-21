import {Routes} from '@angular/router';

import {GuestLayoutComponent} from './layouts/guest-layout/guest-layout.component';
import {LoginComponent} from './guest/login/login.component';
import {SignUpComponent} from './guest/sign-up/sign-up.component';
import {LayoutComponent as StudentLayoutComponent} from './student/layout/layout.component';
import {IndexComponent as GraduationProgressComponent} from './student/graduation-progress/index/index.component';
import {RegisterComponent as GraduationProgressRegisterComponent} from './student/graduation-progress/register/register.component';
import {ProfileComponent} from './student/profile/profile.component';
import {AcademicTablesComponent} from './student/academic-tables/academic-tables.component';
import {ResultsComponent} from './student/results/results.component';
import {ResultDetailsComponent} from './student/result-details/result-details.component';
import {WarningsComponent} from './student/warnings/warnings.component';
import {CoursesComponent} from './student/courses/courses.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { StudentDataComponent } from './admin/Student-dataLayout/student-data/student-data.component';
import {StudyScheduleComponent} from './admin/study-schedule/study-schedule.component';
import { StudentDataMainComponent } from './admin/Student-dataLayout/student-data-main/student-data-main.component';
import { StudyScheduleMainComponent } from './admin/study-schedule-main/study-schedule-main.component';
import { ControlMainComponent } from './admin/control-main/control-main.component';
import { SystemSupervisionComponent } from './admin/system-supervision/system-supervision.component';
import { AcademicRegistrationComponent } from './admin/academic-registration/academic-registration.component';
import { StudentResultComponent } from './admin/student-result/student-result.component';
import { StudentScheduleComponent } from './admin/student-schedule/student-schedule.component';
import { StudentMainComponent } from './student/student-main/student-main.component';
import { ChangePasswordComponent } from './student/change-password/change-password.component';
export const routes: Routes = [
  {
    path: "students",
    component: StudentLayoutComponent,
    children: [
      {path: "", redirectTo: "home", pathMatch: "full"},
      {path: "home", component: StudentMainComponent},
      {path: "warnings", component: WarningsComponent},
      {path: "graduation-progress", component: GraduationProgressComponent},
      {path: "profile", component: ProfileComponent},
      {path: "results", component: ResultsComponent},
      {path: "result-details", component: ResultDetailsComponent},
      {path: "academic-tables", component: AcademicTablesComponent},
      {path: "courses", component: CoursesComponent},
      {path: "graduation-progress/register", component: GraduationProgressRegisterComponent},
      {path: "change-password", component: ChangePasswordComponent},
    ]
  },
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'sign-up', component: SignUpComponent},
    ]
  },
    {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {path: '', redirectTo: 'student-data-main', pathMatch: 'full'}, //first componet
      {path:'student-data-main',component:StudentDataMainComponent},
      {path: 'student-data', component: StudentDataComponent},
      {path:'study-schedules-main',component:StudyScheduleMainComponent},
      {path: 'study-schedules',component:StudyScheduleComponent},
      {path:'system-supervision',component:SystemSupervisionComponent},
      {path:'academic-registration',component:AcademicRegistrationComponent},
      {path: 'control', component: ControlMainComponent},
      {path:'student-result',component:StudentResultComponent},
      {path:'student-schedule',component:StudentScheduleComponent},
      {path: 'sign-up', component: SignUpComponent},
    ]
  },

];
