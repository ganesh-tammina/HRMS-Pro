import { Component, Input, OnInit } from '@angular/core';
import { OnboardingMainheaderComponent } from '../onboarding-mainheader/onboarding-mainheader.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { IonicModule } from '@ionic/angular';
import { CreateOfferHeaderComponent } from '../create-offer-header/create-offer-header.component';
import { CandidateService } from 'src/app/services/pre-onboarding.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss'],
  standalone: true,
  imports: [OnboardingMainheaderComponent, HeaderComponent, IonicModule, CreateOfferHeaderComponent]
})
export class CreateOfferComponent implements OnInit {
  candidate: any;
  constructor(private router: Router,
    private http: HttpClient,
    private candidateService: CandidateService) { }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.candidate = nav?.extras.state?.['candidate'];
    console.log('Candidate received in CreateOffer:', this.candidate);
  }

}
