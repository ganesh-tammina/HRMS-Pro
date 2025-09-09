import { Component, OnInit } from '@angular/core';
import { IonicModule, IonPopover } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateService } from 'src/app/services/pre-onboarding.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { OnboardingMainheaderComponent } from '../onboarding-mainheader/onboarding-mainheader.component';
import { CreateOfferHeaderComponent } from '../create-offer-header/create-offer-header.component';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    HeaderComponent,
    OnboardingMainheaderComponent,
    CreateOfferHeaderComponent
  ]
})
export class CreateOfferComponent implements OnInit {
  candidate: any = {};
  offerForm!: FormGroup;
  selectedDate: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private candidateService: CandidateService
  ) { }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.candidate = nav?.extras.state?.['candidate'] || {};

    if (!this.candidate.offerDetails) {
      this.candidate.offerDetails = { DOJ: '', offerValidity: '' };
    }

    this.offerForm = this.fb.group({
      DOJ: [this.candidate.offerDetails.DOJ || '', Validators.required],
      offerValidity: [this.candidate.offerDetails.offerValidity || '', Validators.required]
    });

    this.selectedDate = this.candidate.offerDetails.DOJ || '';
  }

  onDateChange(event: any, popover: IonPopover) {
    const value = event.detail.value;
    if (value) {
      const date = new Date(value);
      const formatted = date.toLocaleDateString('en-GB');
      this.selectedDate = formatted;
      this.candidate.offerDetails.DOJ = formatted;
      this.offerForm.patchValue({ DOJ: formatted });
    }
    popover.dismiss();
  }

  submitOfferForm() {
    if (this.offerForm.valid) {
      this.candidate.offerDetails.DOJ = this.offerForm.value.DOJ;
      this.candidate.offerDetails.offerValidity = this.offerForm.value.offerValidity;

      this.candidateService.updateCandidate(this.candidate).subscribe({
        next: (res) => {
          console.log('Candidate updated on server:', res);
          alert('DOJ saved successfully in DB!');
          // Pass candidate to Compensation component
          this.router.navigate(['/salaryStaructure', this.candidate.id, encodeURIComponent(this.candidate.personalDetails.FirstName)], { state: { candidate: this.candidate } });
        },
        error: (err) => {
          console.error('Error updating candidate:', err);
          alert('Failed to save DOJ in DB.');
        }
      });
    } else {
      alert('Please select a Date of Joining!');
    }
  }
}
