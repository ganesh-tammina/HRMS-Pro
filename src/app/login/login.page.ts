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


  forgotForm!: FormGroup;
  showForgotModal = false;
  sending = false;
  forgotSuccess = '';
  forgotError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private candidateService: CandidateService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.candidateService.getAdminById('1').subscribe(data => {
      this.adminData = data;
    });


    this.forgotForm = this.fb.group({
      forgotEmail: ['', [Validators.required, Validators.email]]
    });
  }

  onLogin() {
    const { email, password } = this.loginForm.value;

    // ✅ Optional fallback hardcoded admin
    if (this.loginForm.value.email == this.adminData.username && this.loginForm.value.password == this.adminData.password) {
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

  openForgotModal() {
    this.forgotSuccess = '';
    this.forgotError = '';
    this.sending = false;
    this.forgotForm.reset();
    this.showForgotModal = true;
  }

  closeForgotModal() {
    this.showForgotModal = false;
    this.forgotSuccess = '';
    this.forgotError = '';
    this.sending = false;
  }
  submitForgot() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    const email = this.forgotForm.value.forgotEmail;
    this.sending = true;
    this.forgotError = '';
    this.forgotSuccess = '';

    this.candidateService.getotp(email).subscribe({
      next: (response) => {
        console.log('OTP Response:', response);
        this.sending = false;
        this.forgotSuccess = `Password reset email sent to ${email}.`;

        // Close modal after success
        setTimeout(() => this.closeForgotModal(), 2500);
      },
      error: (error) => {
        console.error('Error sending OTP:', error);
        this.sending = false;
        this.forgotError = 'Failed to send OTP. Please try again.';
      },
    });
    // If you need to handle the result, ensure getotp returns an Observable and use .subscribe()
    // Otherwise, if getotp returns a Subscription, you can use it as is or refactor getotp to return an Observable if needed.
    setTimeout(() => {
      this.sending = false;
      this.forgotSuccess = `Password reset email sent to ${email}.`;
      setTimeout(() => this.closeForgotModal(), 2500);
    }, 1000);
  }
}
