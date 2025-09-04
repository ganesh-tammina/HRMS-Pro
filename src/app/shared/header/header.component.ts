import { Component, OnInit } from '@angular/core';
import { CandidateService, Candidate } from 'src/app/services/pre-onboarding.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonIcon,
  IonAvatar,
  IonLabel,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar,
    IonIcon,
    IonAvatar,
    IonLabel,
    IonButton
  ]
})
export class HeaderComponent implements OnInit {

  currentCandidate: Candidate | null = null;

  constructor(private candidateService: CandidateService) { }

  ngOnInit() {
    // Subscribe to current candidate observable
    this.candidateService.currentCandidate$.subscribe(user => {
      this.currentCandidate = user;
    });

    // Fallback: if page refreshed
    if (!this.currentCandidate) {
      this.currentCandidate = this.candidateService.getCurrentCandidate();
    }
  }

  logout() {
    this.candidateService.logout();
    window.location.href = '/login';
  }
}
