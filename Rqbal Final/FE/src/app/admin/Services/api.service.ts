import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
// private api = environment.apiUrl;
private api = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getStudents() {
  // Get the token from wherever you store it (e.g., auth service, localStorage)
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MDI5NDYyNywiaWF0IjoxNzUwMjA4MjI3LCJqdGkiOiJlZTQ0NDExYmU1ZjE0MjkwYTkxMTI0ODY3ZDdhOGUxMCIsInVzZXJfaWQiOjF9.tbA_EtIXSbbN5EBDiIMFZbdPrevkayYrr06n1PnJP0A";
  //  localStorage.getItem('access_token'); 
  // // or from your auth service
  
  // Add Authorization header with the Bearer token
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<any[]>(this.api + "accounts/student/enrollments", { headers });
}
  getData() {
    return this.http.get<any[]>(this.api);
  }

  getDataById(id: number) {
    return this.http.get(`${this.api}/${id}`);
  }
}
