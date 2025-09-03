import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { CandidateService, Candidate } from '../services/pre-onboarding.service';
import { AttendanceService, AttendanceRecord } from '../services/attendance.service';
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

  currentTime: string = '';
  currentDate: string = '';
  status: string = 'Not Present';

  constructor(
    private candidateService: CandidateService,
    private attendanceService: AttendanceService
  ) { }

  ngOnInit() {
    this.employee = this.candidateService.getCurrentCandidate() || undefined;
    if (!this.employee) return;

    this.record = this.attendanceService.getRecord(this.employee.id);
    this.updateTimes();
    setInterval(() => this.updateTimes(), 1000);
  }

  clockIn() {
    if (!this.employee) return;
    this.record = this.attendanceService.clockIn(this.employee.id);
    this.updateTimes();
  }

  clockOut() {
    if (!this.employee) return;
    this.record = this.attendanceService.clockOut(this.employee.id);
    this.updateTimes();
  }

  updateTimes() {
    if (!this.record) return;

    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { hour12: true });
    this.currentDate = now.toDateString();

    const today = new Date().toISOString().split('T')[0];

    // Total milliseconds worked today
    let totalMs = this.record.accumulatedMsToday;
    if (this.record.isClockedIn && this.record.lastClockInTime) {
      totalMs += now.getTime() - new Date(this.record.lastClockInTime).getTime();
    }

    const grossMinutes = Math.floor(totalMs / 60000);
    this.grossHours = this.formatHoursMinutes(grossMinutes);

    const effectiveMinutes = Math.max(grossMinutes - this.breakMinutes, 0);
    this.effectiveHours = this.formatHoursMinutes(effectiveMinutes);

    this.timeSinceLastLogin = this.formatHMS(totalMs);

    // Status for today
    this.status = this.record.lastClockDate === today ? 'Present' : 'Not Present';
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
