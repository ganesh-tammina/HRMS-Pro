import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle,
  IonInput, IonCheckbox, IonButton,
  IonToolbar, IonLabel, IonItem, IonSelectOption, IonSelect
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../shared/header/header.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreOnboardingService } from '../services/pre-onboarding.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent,
    IonInput, IonCheckbox, IonButton, IonSelectOption, IonSelect, IonLabel, IonItem,
    IonHeader, IonTitle, IonToolbar, HttpClientModule, CommonModule, HeaderComponent, FormsModule, ReactiveFormsModule],
})
export class PostPage implements OnInit {
  selectedCard: string | null = null;
  personalForm!: FormGroup;
  constructor(private fb: FormBuilder, private service: PreOnboardingService, private http: HttpClient) {

  }

  ngOnInit() {
    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/) // Valid 10-digit Indian phone number
      ]],
    });
  }

/*************  ✨ Windsurf Command ⭐  *************/

/*******  faf94c3b-dae6-4f98-a267-46321c099542  *******/  openCard(card: string) {
    this.selectedCard = card;
  }

  onSubmit() {
    if (this.personalForm.valid) {
      const data = this.personalForm.value;
      this.http.post('http://localhost:3000/employees', data).subscribe(response => {
        console.log('Data saved successfully:', response);
      })
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.personalForm.reset();
  }

}
