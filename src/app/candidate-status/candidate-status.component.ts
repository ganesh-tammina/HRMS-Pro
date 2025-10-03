import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { IonicModule } from '@ionic/angular';
import { CandidateService } from '../services/pre-onboarding.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

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
  onboardingForms!: FormGroup

  constructor(private candidateService: CandidateService, private alertController: AlertController, private route: ActivatedRoute, private fb: FormBuilder) { }

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



  async candidateapprove(action: any) {
    const alert = await this.alertController.create({
      header: 'Action Selected',
      message: `You clicked on ${action.toUpperCase()}`,
      buttons: ['OK'],
    });
    console.log(action),


      await alert.present();
  }

}
