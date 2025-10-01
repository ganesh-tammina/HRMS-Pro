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
  passwordUpdateForm!: FormGroup;
  forgotForm!: FormGroup;

  showLoginForm = true;
  showPasswordUpdateForm = false;
  showForgotModal = false;

  loginError = '';
  forgotError = '';
  forgotSuccess = '';
  sending = false;
  adminData: any | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private candidateService: CandidateService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.passwordUpdateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.forgotForm = this.fb.group({
      forgotEmail: ['', [Validators.required, Validators.email]],
    });

    this.candidateService.getAdminById('1').subscribe(data => {
      this.adminData = data;
    });
  }

  onLogin() {
    const { email, password } = this.loginForm.value;

    if (email === this.adminData?.username && password === this.adminData?.password) {
      const user: LoggedUser = { type: 'admin', data: { UserName: 'admin' } };
      this.authService.setUser(user);
      this.router.navigate(['/admin']);
      return;
    }

    this.candidateService.findEmployee(email, password).subscribe(
      found => {
        if (found) {
          const user: LoggedUser = { type: 'employee', data: found };
          this.authService.setUser(user);
          this.router.navigate(['/Home']);
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

  openForgotModal() {
    this.showForgotModal = true;
    this.forgotForm.reset();
    this.forgotError = '';
    this.forgotSuccess = '';
  }

  closeForgotModal() {
    this.showForgotModal = false;
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

    this.candidateService.newpasswordCreation(email).subscribe({
      next: (res) => {
        console.log('✅ OTP sent:', res);
        this.forgotSuccess = `OTP sent to ${email}.`;
        setTimeout(() => {
          this.sending = false;
          this.closeForgotModal();
          // 🔥 Switch to password update form
          this.showLoginForm = false;
          this.showPasswordUpdateForm = true;
          this.passwordUpdateForm.patchValue({ email });
        }, 2000);
      },
      error: (err) => {
        console.error('❌ OTP sending failed:', err);
        this.sending = false;
        this.forgotError = 'Failed to send OTP. Try again later.';
      }
    });
  }

  onPasswordUpdate() {
    if (this.passwordUpdateForm.invalid) {
      this.passwordUpdateForm.markAllAsTouched();
      return;
    }

    const { email, otp, newPassword } = this.passwordUpdateForm.value;

    this.candidateService.verifyAndResetPassword(email, otp, newPassword).subscribe({
      next: () => {
        alert('Password updated successfully!');
        this.showPasswordUpdateForm = false;
        this.showLoginForm = true;
        this.passwordUpdateForm.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update password. Check OTP and try again.');
      }
    });
  }
}
