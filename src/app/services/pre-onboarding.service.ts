import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Candidate {
  id: number;
  personalDetails: {
    FirstName: string;
    MiddleName?: string;
    LastName: string;
    PhoneNumber: string;
    email: string;
    gender: string;
    initials?: string;
  };
  jobDetailsForm: {
    JobTitle: string;
    Department: string;
    JobLocation: string;
    WorkType: string;
    BussinessUnit: string;
  };
  offerDetails?: {
    DOJ?: string;
    offerValidity?: string;
    JoiningDate?: string;
  };
  employeeCredentials?: {
    companyEmail: string;
    password: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates';

  private candidatesSubject = new BehaviorSubject<Candidate[]>([]);
  candidates$ = this.candidatesSubject.asObservable();

  private currentCandidateSubject = new BehaviorSubject<Candidate | null>(null);
  currentCandidate$ = this.currentCandidateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.http.get<Candidate[]>(this.apiUrl).subscribe({
      next: (data) => this.candidatesSubject.next(data),
      error: (err) => console.error('Error loading candidates:', err)
    });
  }

  createCandidate(candidateData: Candidate): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, candidateData).pipe(
      tap((newCandidate) => {
        const current = this.candidatesSubject.value;
        this.candidatesSubject.next([...current, newCandidate]);
      })
    );
  }

  updateCandidate(candidate: Candidate): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/${candidate.id}`, candidate).pipe(
      tap((updated) => {
        const current = this.candidatesSubject.value.map(c =>
          c.id === updated.id ? updated : c
        );
        this.candidatesSubject.next(current);
      })
    );
  }

  findEmployee(email: string, password: string): Candidate | undefined {
    const found = this.candidatesSubject.value.find(c =>
      c.employeeCredentials?.companyEmail === email &&
      c.employeeCredentials?.password === password
    );

    if (found) {
      this.currentCandidateSubject.next(found); // ✅ store the logged-in candidate
      localStorage.setItem('loggedInCandidate', JSON.stringify(found)); // optional: persist
    }

    return found;
  }

  getCurrentCandidate(): Candidate | null {
    return this.currentCandidateSubject.value;
  }
}

