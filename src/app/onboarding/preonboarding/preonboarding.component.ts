import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { OnboardingMainheaderComponent } from '../onboarding-mainheader/onboarding-mainheader.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { Router } from '@angular/router';
import { CandiateCreateComponent } from '../candiate-create/candiate-create.component';
import { CandidateService } from 'src/app/services/pre-onboarding.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StartOnboardingComponent } from '../start-onboarding/start-onboarding.component';

@Component({
  selector: 'app-preonboarding',
  templateUrl: './preonboarding.component.html',
  styleUrls: ['./preonboarding.component.scss'],
  standalone: true,
  imports: [
    OnboardingMainheaderComponent,
    CommonModule,
    IonicModule,
    HeaderComponent
  ]
})
export class PreonboardingComponent implements OnInit {

  // 👇 All candidates loaded from service
  candidates: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private candidateService: CandidateService
  ) { }

  ngOnInit() {
    // Subscribe to candidates from service
    this.candidateService.candidates$.subscribe(data => {
      this.candidates = data;
      console.log('Candidates:', this.candidates);
    });
  }

  // Navigate to candidate create (non-modal)
  addCandidate() {
    this.router.navigate(['/CandiateCreate']);
  }

  // Start Pre-Onboarding for a selected candidate
  async startpreonboarding(candidate: any) {
    const modal = await this.modalCtrl.create({
      component: StartOnboardingComponent,
      componentProps: {
        candidate: candidate,        // ✅ selected candidate’s ID
      }
    });

    await modal.present();
  }

  // Open form in modal
  async openCandidateForm() {
    const modal = await this.modalCtrl.create({
      component: CandiateCreateComponent
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      console.log('Form Submitted Data:', data);
      // ✅ add candidate to array if needed
      // this.candidates.push(data);
    }
  }

}
