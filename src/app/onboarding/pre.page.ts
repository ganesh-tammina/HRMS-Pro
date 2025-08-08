import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonModal,
  IonInput, IonCheckbox, IonButton, IonButtons,
  IonToolbar, IonLabel, IonItem, IonSelectOption, IonSelect
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../shared/header/header.component';
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
  offerForm!: FormGroup;
  policyForm!: FormGroup;
  confirmDetails!: FormGroup;

  selectedCard = '';
  isSalaryModalOpen = false;
  isOfferPreviewOpen = false;

  offerLetter: any = null;
  private salarySaved = false;

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

    this.salaryForm = this.fb.group({
      grossSalary: ['', Validators.required],
      basicSalary: ['', Validators.required],
      hra: ['', Validators.required],
      health: ['', Validators.required],
      epfEmployee: ['', Validators.required],
      epfEmployer: [{ value: '', disabled: true }]
    });

    this.salaryForm.get('epfEmployee')!.valueChanges.subscribe(val => {
      const emp = Number(val) || 0;
      this.salaryForm.get('epfEmployer')!.setValue(emp, { emitEvent: false });
    });

    this.offerForm = this.fb.group({
      offerValidity: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      template: ['', Validators.required]
    });

    this.policyForm = this.fb.group({
      offerStatus: ['', Validators.required],
      policyAccepted: [false, Validators.requiredTrue]
    });

    this.confirmDetails = this.fb.group({
      offerValidity: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
    })
  }

  openCard(card: string) {
    this.selectedCard = card;
  }

  nextFromPersonal() {
    if (this.personalForm.get('personalDetails')?.valid) {
      this.selectedCard = 'salary';
      this.openSalaryModal();
    } else {
      this.personalForm.get('personalDetails')?.markAllAsTouched();
    }
  }

  openSalaryModal() {
    this.isSalaryModalOpen = true;
    this.selectedCard = '';
  }

  closeSalaryModal() {
    this.isSalaryModalOpen = false;
  }

  saveSalary() {
    if (!this.salaryForm.valid) {
      this.salaryForm.markAllAsTouched();
      return;
    }

    const personalDetails = this.personalForm.get('personalDetails')!.value;
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

    this.http.post('http://localhost:3000/employees', employeeData).subscribe({
      next: () => {
        this.closeSalaryModal();
        this.selectedCard = 'offer';
        this.salarySaved = true;
      },
      error: (err) => {
        console.error('Error saving to server:', err);
      }
    });
  }

  canPreviewOffer(): boolean {
    return this.offerForm.valid && this.salarySaved;
  }

  previewOfferLetter() {
    if (!this.canPreviewOffer()) return;

    this.http.get<any[]>('http://localhost:3000/employees?_sort=id&_order=desc&_limit=1')
      .subscribe(latest => {
        if (latest.length > 0) {
          const candidate = latest[0];
          const formValues = this.offerForm.value;

          const now = new Date();
          const y = now.getFullYear().toString();
          const m = (now.getMonth() + 1).toString().padStart(2, '0');
          const d = now.getDate().toString().padStart(2, '0');
          const random4 = Math.floor(1000 + Math.random() * 9000).toString();
          const candidateId = y + m + d + random4;

          this.offerLetter = {
            ...candidate,
            id: candidateId,
            originalId: candidate.id,
            offerValidity: formValues.offerValidity,
            dateOfJoining: formValues.dateOfJoining,
            template: formValues.template
          };

          this.isOfferPreviewOpen = true;
        }
      });
  }

  goToPolicy() {
    if (!this.offerLetter) {
      alert('Please preview the offer before proceeding to policy step.');
      return;
    }
    this.selectedCard = 'Policy';
  }

  onCancel() {
    this.personalForm.reset();
    this.salaryForm.reset();
    this.offerForm.reset();
    this.policyForm.reset();
    this.offerLetter = null;
    this.salarySaved = false;
  }

  sendOfferStatus() {
    if (!this.offerLetter) {
      alert('Please preview the offer before sending.');
      return;
    }

    if (this.policyForm.invalid) {
      alert('Please select an offer status and accept the policy.');
      return;
    }

    const updateData = {
      offerStatus: this.policyForm.value.offerStatus,
      candidateId: this.offerLetter.id,
      confirmation: {
        offerValidity: this.offerLetter.offerValidity,
        dateOfJoining: this.offerLetter.dateOfJoining,
        template: this.offerLetter.template
      }
    };

    this.http.patch(`http://localhost:3000/employees/${this.offerLetter.originalId}`, updateData)
      .subscribe({
        next: () => {
          alert('Offer status updated successfully!');
          this.selectedCard = '';
        },
        error: (err) => {
          console.error('Error updating offer status:', err);
          alert('Failed to update offer status.');
        }
      });
  }
}
