import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class EmailService {
  private beURL = 'http://localhost:3562/send-email'

  constructor(private http: HttpClient) { }

  sendEmail(candidate: any): Observable<any> {
    console.log(candidate)

    const data = {
      // change this mail as it is hard coded. ⬇️
      to: candidate.personalDetails.email,
      // this mail ⬆️
      subject: 'Welcome to our company!',
      text: `Hi ${candidate.personalDetails.FirstName},\n\nWelcome to our company! We are excited to have you join our team. Please find your Login Crefentials Down below: \n\n Email: ${candidate.personalDetails.email}\n Password: ${candidate.employeeCredentials?.password} \n\nBest regards,\nYour Company Team`
    }
    return this.http.post<any>(`${this.beURL}`, data).pipe(
      tap((updated) => {
        if (!updated.success) {
          alert("Failed to send email. Please try again.");
        }
      })
    );
  }

}
