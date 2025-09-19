import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CandidateService, Candidate } from 'src/app/services/pre-onboarding.service';

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

  constructor(private fb: FormBuilder, private router: Router, private candidateService: CandidateService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.candidateService.findEmployee(email, password).subscribe(found => {
        if (found) {
          this.router.navigate(['/Home'], { state: { candidate: found } });
        } else {
          this.loginError = 'Invalid email or password';
        }
      });
    } else {
      this.loginError = 'Please fill all fields correctly';
    }
  }
}
