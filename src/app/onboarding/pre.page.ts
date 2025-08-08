import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonModal,
  IonInput, IonCheckbox, IonButton, IonButtons,
  IonToolbar, IonLabel, IonItem, IonSelectOption, IonSelect
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../shared/header/header.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post',
  templateUrl: './pre.page.html',
  styleUrls: ['./pre.page.scss'],
  standalone: true,
  imports: [
    IonContent, HeaderComponent,
    IonInput, IonCheckbox, IonButton, IonSelectOption, IonModal, IonSelect, IonLabel, IonItem,
    IonHeader, IonTitle, IonToolbar, HttpClientModule, IonButtons,
    CommonModule, FormsModule, ReactiveFormsModule
  ],
})
export class PostPage implements OnInit {
  personalForm!: FormGroup;
  salaryForm!: FormGroup;
  selectedCard = '';
  isSalaryModalOpen = false;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      personalDetails: this.fb.group({
        fullName: ['', Validators.required],
        dob: ['', Validators.required],
        gender: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required]
      }),
      previousCompany: this.fb.group({
        CompanyName: [''],
        Role: [''],
        Reason: ['']
      })
    });

    // epfEmployer is disabled (readonly) and will be set automatically below
    this.salaryForm = this.fb.group({
      grossSalary: ['', Validators.required],
      basicSalary: ['', Validators.required],
      hra: ['', Validators.required],
      health: ['', Validators.required],
      epfEmployee: ['', Validators.required],
      epfEmployer: [{ value: '', disabled: true }]
    });

    // Auto-fill employer EPF when employee EPF changes.
    // Change formula here if you want (e.g., 0.12 * basicSalary).
    this.salaryForm.get('epfEmployee')!.valueChanges.subscribe(val => {
      const emp = Number(val) || 0;
      // keep employer same as employee by default
      this.salaryForm.get('epfEmployer')!.setValue(emp, { emitEvent: false });
    });
  }

  openCard(card: string) {
    this.selectedCard = card;
  }

  nextFromPersonal() {
    if (this.personalForm.get('personalDetails')?.valid) {
      this.openSalaryModal();
    } else {
      this.personalForm.get('personalDetails')?.markAllAsTouched();
      console.log('Personal details invalid:', this.personalForm.get('personalDetails')?.errors);
    }
  }

  openSalaryModal() {
    this.isSalaryModalOpen = true;
  }

  closeSalaryModal() {
    this.isSalaryModalOpen = false;
  }

  saveSalary() {
    // salaryForm.valid will exclude disabled controls — fine because epfEmployer is disabled and not required.
    if (!this.salaryForm.valid) {
      this.salaryForm.markAllAsTouched();
      console.warn('Salary form invalid:', this.salaryForm);
      return;
    }

    const personalDetails = this.personalForm.get('personalDetails')!.value;
    // use getRawValue() to include disabled controls (epfEmployer)
    const salaryDetails = this.salaryForm.getRawValue();

    const employeeData = {
      name: personalDetails.fullName,
      dob: personalDetails.dob,
      gender: personalDetails.gender,
      email: personalDetails.email,
      phone: personalDetails.phone,
      salary: {
        gross: Number(salaryDetails.grossSalary),
        basic: Number(salaryDetails.basicSalary),
        hra: Number(salaryDetails.hra),
        health: Number(salaryDetails.health),
        epfEmployee: Number(salaryDetails.epfEmployee),
        epfEmployer: Number(salaryDetails.epfEmployer)
      }
    };

    console.log('Posting to /employees:', employeeData);

    this.http.post('http://localhost:3000/employees', employeeData).subscribe({
      next: (res) => {
        console.log('Saved:', res);
        this.closeSalaryModal();
        this.selectedCard = 'Previous_Company';
        // optionally reset forms, show a toast, etc.
      },
      error: (err) => {
        console.error('Error saving to server:', err);
        // helpful hint: CORS or server not running are the usual causes
      }
    });
  }

  onNext(card: string) {
    this.selectedCard = card;
  }

  onCancel() {
    this.personalForm.reset();
    this.salaryForm.reset();
  }

  onSubmit() {
    console.log('Form submitted', this.personalForm.value);
  }
}
