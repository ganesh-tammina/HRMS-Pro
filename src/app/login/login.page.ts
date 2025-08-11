import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  currentYear: number = new Date().getFullYear();
  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToDashboard() {
    this.router.navigate(['/Home']);
  }
  onLogin() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Remember Me:', this.rememberMe);
    // TODO: Implement authentication logic here
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
