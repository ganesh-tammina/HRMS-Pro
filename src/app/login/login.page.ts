import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CandidateService } from 'src/app/services/pre-onboarding.service';
import { AuthService, LoggedUser } from '../Administration/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loginError: string = '';
  adminData: any | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private candidateService: CandidateService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,]],
      password: ['', Validators.required]
    });
    this.candidateService.getAdminById('1').subscribe(data => {
      this.adminData = data;
      console.log('Admin Data:', this.adminData);
    });
  }

  onLogin() {
    const { email, password } = this.loginForm.value;

    // ✅ Optional fallback hardcoded admin
    if (this.loginForm.value.email == 'admin' && this.loginForm.value.password == 'admin') {
      const user: LoggedUser = { type: 'admin', data: { UserName: 'admin' } };
      this.authService.setUser(user);
      console.log('Employee logged in:', user);
      this.router.navigate(['/admin']);
    }
    else {
      this.candidateService.findEmployee(email, password).subscribe(
        found => {
          if (found) {
            const user: LoggedUser = { type: 'employee', data: found };
            this.authService.setUser(user);
            console.log('Employee logged in:', user);
            this.router.navigate(['/Home']); // must match route path
          } else {
            this.loginError = 'Invalid email or password';
          }
        },
        err => {
          console.error(err);
          this.loginError = 'Login failed. Please try again later.';
        }
      );
    }

  }
}
