import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { CandidateService, Candidate } from '../services/pre-onboarding.service';
import { AttendanceService, AttendanceRecord, AttendanceEvent } from '../services/attendance.service';
import { EmployeeHeaderComponent } from './employee-header/employee-header.component';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, EmployeeHeaderComponent, CommonModule]
})
export class MePage implements OnInit {
  employee?: Candidate;
  record?: AttendanceRecord;

  breakMinutes: number = 60;
  effectiveHours: string = '0h 0m';
  grossHours: string = '0h 0m';
  timeSinceLastLogin: string = '0h 0m 0s';
  status: string = 'Absent';

  currentTime: string = '';
  currentDate: string = '';
  history: AttendanceEvent[] = [];
  selectedRange: 'TODAY' | 'WEEK' | 'MONTH' | 'ALL' = 'TODAY';

  constructor(
    private candidateService: CandidateService,
    private attendanceService: AttendanceService
  ) { }

  ngOnInit() {
    this.employee = this.candidateService.getCurrentCandidate() || undefined;
    if (!this.employee) return;

    this.record = this.attendanceService.getRecord(this.employee.id);

    this.updateTimes();
    this.loadHistory();

    setInterval(() => {
      this.updateTimes();
      this.loadHistory();
    }, 1000);
  }

  get employeeName(): string {
    return this.employee?.personalDetails?.FirstName || '';
  }

  clockIn() {
    if (!this.employee) return;
    this.record = this.attendanceService.clockIn(this.employee.id);
    this.updateTimes();
    this.loadHistory();
  }

  clockOut() {
    if (!this.employee) return;
    this.record = this.attendanceService.clockOut(this.employee.id);
    this.updateTimes();
    this.loadHistory();
  }

  updateTimes() {
    if (!this.record) return;
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { hour12: true });
    this.currentDate = now.toDateString();

    const today = this.currentDate;
    const dailyMs = this.record.dailyAccumulatedMs?.[today] || 0;

    // Total gross = all accumulated today + ongoing session
    let totalMs = dailyMs;
    let sessionMs = 0;
    if (this.record.isClockedIn && this.record.clockInTime) {
      sessionMs = now.getTime() - new Date(this.record.clockInTime).getTime();
      totalMs += sessionMs;
    }

    // Session timer since last login
    this.timeSinceLastLogin = this.formatHMS(sessionMs);

    // Gross hours today
    const grossMinutes = Math.floor(totalMs / 60000);
    this.grossHours = this.formatHoursMinutes(grossMinutes);

    const effectiveMinutes = Math.max(grossMinutes - this.breakMinutes, 0);
    this.effectiveHours = this.formatHoursMinutes(effectiveMinutes);

    // Status: Present if any accumulated hours today
    this.status = totalMs > 0 ? 'Present' : 'Absent';
  }

  loadHistory() {
    if (!this.record) return;
    const rawHistory = this.attendanceService.getHistoryByRange(this.record, this.selectedRange);
    this.history = rawHistory.map(event => ({
      ...event,
      displayTime: new Date(event.time).toLocaleTimeString('en-US', { hour12: true })
    }));
  }

  changeRange(range: 'TODAY' | 'WEEK' | 'MONTH' | 'ALL') {
    this.selectedRange = range;
    this.loadHistory();
  }

  formatHoursMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  formatHMS(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }
}
