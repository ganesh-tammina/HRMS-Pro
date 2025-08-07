import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PreOnboardingService {
  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/employees';

  postPersonalInfo(data: any) {
    return this.http.post(this.apiUrl, data);
  }
}
