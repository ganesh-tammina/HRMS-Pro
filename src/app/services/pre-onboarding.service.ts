import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AttendanceService } from './attendance.service';

export interface Candidate {
  id: number;
  personalDetails: {
    FirstName: string;
    LastName: string;
    PhoneNumber: string;
    email: string;
    gender: string;
    profileImage?: string;
  };
  jobDetailsForm: {
    JobTitle: string;
    Department: string;
    JobLocation: string;
    WorkType: string;
    BussinessUnit: string;
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
  private apiUrl = 'http://localhost:3562/candidates';

  private candidatesSubject = new BehaviorSubject<Candidate[]>([]);
  candidates$ = this.candidatesSubject.asObservable();

  // ✅ initialize with stored candidate (so refresh works)
  private currentCandidateSubject = new BehaviorSubject<Candidate | null>(this.getStoredCandidate());
  currentCandidate$ = this.currentCandidateSubject.asObservable();

  constructor(private http: HttpClient, private attendanceService: AttendanceService) {
    this.loadCandidates();
  }

  private getStoredCandidate(): Candidate | null {
    const activeId = localStorage.getItem('activeUserId');
    if (!activeId) return null;

    const stored = localStorage.getItem(`loggedInCandidate_${activeId}`);
    return stored ? JSON.parse(stored) : null;
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
      this.currentCandidateSubject.next(found);

      // ✅ persist user for refresh
      localStorage.setItem(`loggedInCandidate_${found.id}`, JSON.stringify(found));
      localStorage.setItem('activeUserId', found.id.toString());

      // Initialize attendance record
      this.attendanceService.getRecord(found.id);
    }

    return found;
  }

  getCurrentCandidate(): Candidate | null {
    return this.currentCandidateSubject.value;
  }

  logout() {
    const activeId = localStorage.getItem('activeUserId');
    if (activeId) {
      localStorage.removeItem(`loggedInCandidate_${activeId}`);
      localStorage.removeItem('activeUserId');
    }
    this.currentCandidateSubject.next(null);
  }

  // -----------------------------
  // Search method for header
  // -----------------------------
  searchCandidates(query: string): Candidate[] {
    const lowerQuery = query.toLowerCase().trim();
    return this.candidatesSubject.value.filter(c =>
      c.personalDetails.FirstName.toLowerCase().includes(lowerQuery) ||
      c.personalDetails.LastName.toLowerCase().includes(lowerQuery)
    );
  }
}
