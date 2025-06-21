import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
 private apiUrl = `${environment.apiUrl}/accounts/change-password/`;

  constructor(private http: HttpClient) { }
changePassword(passwordData: { 
    old_password: string, 
    new_password: string,
    new_password2: string 
  }): Observable<any> {
    return this.http.post(this.apiUrl, passwordData, { 
      headers: this.getAuthHeaders() 
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}