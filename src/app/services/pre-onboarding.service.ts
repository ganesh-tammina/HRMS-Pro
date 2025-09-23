import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
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
  offerDetails?: {
    DOJ?: string;
    offerValidity?: number;
    JoiningDate?: string;
  };
  packageDetails?: {
    annualSalary: number;
    basic?: number;
    hra?: number;
    medical?: number;
    transport?: number;
    special?: number;
    subtotal?: number;
    pfEmployer?: number;
    pfEmployee?: number;
    total?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private api = "http://localhost:3562/";
  private apiUrl = `${this.api}candidates/jd`;
  private offerUrl = `${this.api}candidates/offer-details`;
  private packageUrl = `${this.api}candidates/package-details`;   // ✅ for package details
  private getapiUrl = 'http://localhost:3562/candidates';

  private candidatesSubject = new BehaviorSubject<Candidate[]>([]);
  candidates$ = this.candidatesSubject.asObservable();

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
    this.http.get<any>(this.getapiUrl).subscribe({
      next: (data) => {
        const candidates = this.normalizeCandidates(data);
        this.candidatesSubject.next(candidates);
      },
      error: (err) => console.error('Error loading candidates:', err)
    });
  }

  private normalizeCandidates(data: any): Candidate[] {
    if (Array.isArray(data)) return data;
    if (data && data.candidates && Array.isArray(data.candidates)) return data.candidates;
    if (data) return [data];
    return [];
  }

  createCandidate(candidateData: Candidate): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, candidateData).pipe(
      tap((newCandidate) => {
        const current = this.candidatesSubject.value;
        this.candidatesSubject.next([...current, newCandidate]);
      })
    );
  }

  updateCandidate(candidate: any): Observable<Candidate> {
    if (!candidate.offerDetails) {
      return throwError(() => new Error('offerDetails is missing in candidate'));
    }
    if (!candidate.offerDetails.DOJ) {
      return throwError(() => new Error('DOJ is missing in offerDetails'));
    }

    const [day, month, year] = candidate.offerDetails.DOJ.split("/");
    const formattedDOJ = `${year}-${month}-${day}`;

    const postBody = {
      candidateId: candidate.id,
      offerDetails: {
        DOJ: formattedDOJ,
        offerValidity: candidate.offerDetails.offerValidity,
        JoiningDate: candidate.offerDetails.JoiningDate || null
      }
    };

    const putBody = {
      id: candidate.id,
      DOJ: formattedDOJ,
      offerValidity: candidate.offerDetails.offerValidity
    };

    return this.http.post<any>(this.offerUrl, postBody).pipe(
      switchMap(() =>
        this.http.put<Candidate>(this.offerUrl, putBody).pipe(
          tap((updated) => {
            const current = this.candidatesSubject.value.map(c =>
              c.id === updated.id ? updated : c
            );
            this.candidatesSubject.next(current);

            if (this.currentCandidateSubject.value?.id === updated.id) {
              this.currentCandidateSubject.next(updated);
              localStorage.setItem(`loggedInCandidate_${updated.id}`, JSON.stringify(updated));
            }
          })
        )
      )
    );
  }

  // ✅ New method for saving package details
  addPackageDetails(candidate: any): Observable<any> {
    if (!candidate.id) {
      return throwError(() => new Error('Candidate ID is required'));
    }
    if (!candidate.packageDetails || !candidate.packageDetails.annualSalary) {
      return throwError(() => new Error('packageDetails with annualSalary is required'));
    }

    const postBody = {
      candidateId: candidate.id,
      packageDetails: { ...candidate.packageDetails }
    };

    return this.http.post<any>(this.packageUrl, postBody).pipe(
      tap((res) => {
        console.log('Package details saved:', res);
      })
    );
  }

  findEmployee(email: string, password: string): Observable<Candidate | undefined> {
    return this.http.get<any>(this.getapiUrl).pipe(
      map(data => {
        const candidates = this.normalizeCandidates(data);
        return candidates.find(c =>
          c.employeeCredentials?.companyEmail === email &&
          c.employeeCredentials?.password === password
        );
      }),
      tap(found => {
        if (found) {
          this.currentCandidateSubject.next(found);
          localStorage.setItem(`loggedInCandidate_${found.id}`, JSON.stringify(found));
          localStorage.setItem('activeUserId', found.id.toString());
          this.attendanceService.getRecord(found.id);
        }
      })
    );
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

  searchCandidates(query: string): Candidate[] {
    const lowerQuery = query.toLowerCase().trim();
    return this.candidatesSubject.value.filter(c =>
      c.personalDetails.FirstName.toLowerCase().includes(lowerQuery) ||
      c.personalDetails.LastName.toLowerCase().includes(lowerQuery)
    );
  }
}
