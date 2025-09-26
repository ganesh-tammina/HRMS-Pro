import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { IonicModule } from '@ionic/angular';
import { CandidateService } from '../services/pre-onboarding.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-candidate-status',
  templateUrl: './candidate-status.component.html',
  styleUrls: ['./candidate-status.component.scss'],
  standalone: true,
  imports: [HeaderComponent, CommonModule, IonicModule]
})

export class CandidateStatusComponent implements OnInit {
  currentCandidate: any
  activePage: string = 'openPage';
  hideOffer: boolean = false
  candidate: any;
  ids: string = ''

  constructor(private candidateService: CandidateService, private route: ActivatedRoute) { }

  ngOnInit() {

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

  setDiv() {
    this.hideOffer = true
  }

}
