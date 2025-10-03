import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { IonicModule } from '@ionic/angular';
import { CandidateService } from '../services/pre-onboarding.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidate-status',
  templateUrl: './candidate-status.component.html',
  styleUrls: ['./candidate-status.component.scss'],
  standalone: true,
  imports: [HeaderComponent, CommonModule, IonicModule, ReactiveFormsModule]
})

export class CandidateStatusComponent implements OnInit {
  currentCandidate: any
  activePage: string = 'openPage';
  hideOffer: boolean = false
  candidate: any;
  ids: string = ''
  acceptDisabled = false;
  rejectDisabled = false;
  onboardingForms!: FormGroup

  constructor(private candidateService: CandidateService, private http: HttpClient, private alertController: AlertController, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {

    this.onboardingForms = this.fb.group({
      PhoneNumber: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Route param id:', id);


      if (id) {
        this.candidateService.getCandidateById(id).subscribe((data: any) => {
          this.candidate = data;
          console.log('Fetched Candidate by ID:', this.candidate);
        });
      }
    });




  }

  submitOnboarding() {
    if (this.onboardingForms.value.PhoneNumber == this.candidate.PhoneNumber) {
      this.hideOffer = true
    }
    else {
      alert("Please enter valid PhoneNumber")
    }

  }

  async acceptCandidate(candidateId: number) {
    this.rejectDisabled = true;
    const alert = await this.alertController.create({
      header: 'Accept Candidate',
      message: `You accepted candidate with ID: ${candidateId}`,
      buttons: ['OK'],
    });

    try {
      const url = `http://30.0.0.221:3562/offerstatus/accept`;
      const response = await this.http.put(url, { id: candidateId }).toPromise();
      console.log('Accept response:', response);
    } catch (error) {
      console.error('Error accepting candidate:', error);
    }

    await alert.present();
  }

  async rejectCandidate(candidateId: number) {
    this.acceptDisabled = true;
    const alert = await this.alertController.create({
      header: 'Reject Candidate',
      message: `You rejected candidate with ID: ${candidateId}`,
      buttons: ['OK'],
    });

    try {
      const url = `http://30.0.0.221:3562/offerstatus/reject`;
      const response = await this.http.put(url, { id: candidateId }).toPromise();
      console.log('Reject response:', response);
    } catch (error) {
      console.error('Error rejecting candidate:', error);
    }

    await alert.present();
  }





}
