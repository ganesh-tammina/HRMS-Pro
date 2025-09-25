import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { IonicModule } from '@ionic/angular';
import { CandidateService } from '../services/pre-onboarding.service';

@Component({
  selector: 'app-candidate-status',
  templateUrl: './candidate-status.component.html',
  styleUrls: ['./candidate-status.component.scss'],
  standalone: true,
  imports: [HeaderComponent, CommonModule, IonicModule]
})

export class CandidateStatusComponent  implements OnInit {
  currentCandidate: any
  activePage: string = 'openPage';
  hideOffer : boolean = false

  constructor(private candidateService: CandidateService) { }

  ngOnInit() {
    this.candidateService.currentCandidate$.subscribe((user:any) => {
      this.currentCandidate = user;
      console.log('Current Candidate:', this.currentCandidate);
    });
  }

  setDiv() {
   this.hideOffer = true
  }

}
