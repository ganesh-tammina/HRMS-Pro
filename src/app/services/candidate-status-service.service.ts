// candidate-status-service.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateStatusServiceService {
  private candidateSource = new BehaviorSubject<any>(null);
  currentCandidate$ = this.candidateSource.asObservable();

  // update candidate info (status change)
  updateCandidate(candidate: any) {
    this.candidateSource.next(candidate);
  }
}
