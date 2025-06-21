import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { AdminSidebarComponent } from "../../admin/admin-sidebar/admin-sidebar.component";
import { CommonModule } from '@angular/common';
import { FootAdminComponent } from '../../admin/foot-admin/foot-admin.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebarComponent,CommonModule ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
