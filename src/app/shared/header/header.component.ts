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
  IonItem,
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
    IonItem,
    IonLabel,
    IonButton
  ]
})
export class HeaderComponent implements OnInit {

  currentCandidate: Candidate | null = null;

  constructor(private candidateService: CandidateService) { }

  ngOnInit() {
    // Subscribe to the current logged-in candidate
    this.candidateService.currentCandidate$.subscribe(user => {
      this.currentCandidate = user;
    });

    // Fallback: if page refresh, load from localStorage
    if (!this.currentCandidate) {
      const stored = localStorage.getItem('loggedInCandidate');
      if (stored) {
        this.currentCandidate = JSON.parse(stored);
      }
    }
  }

  logout() {
    localStorage.removeItem('loggedInCandidate');
    this.currentCandidate = null;
    window.location.href = '/login';
  }
}
