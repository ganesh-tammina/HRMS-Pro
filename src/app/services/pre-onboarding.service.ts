import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates';

  private candidatesSubject = new BehaviorSubject<any[]>([]);
  candidates$ = this.candidatesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCandidates();
  }

  // Fetch all candidates from server
  loadCandidates() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.candidatesSubject.next(data),
      error: (err) => console.error('Error loading candidates:', err)
    });
  }

  // Create new candidate
  createCandidate(candidateData: any): Observable<any> {
    return this.http.post(this.apiUrl, candidateData).pipe(
      tap((newCandidate: any) => {
        // ✅ Update BehaviorSubject immediately
        const current = this.candidatesSubject.value;
        this.candidatesSubject.next([...current, newCandidate]);
      })
    );
  }
}
