import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { CandidateService, Candidate } from '../services/pre-onboarding.service';
import { AttendanceService, AttendanceRecord } from '../services/attendance.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, CommonModule]
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
  }

  clockOut() {
    if (!this.employee) return;
    this.record = this.attendanceService.clockOut(this.employee.id);
  }

  updateTimes() {
    if (!this.record) return;
    const now = new Date();

    this.currentTime = now.toLocaleTimeString('en-US', { hour12: true });
    this.currentDate = now.toDateString();

    let totalMs = this.record.accumulatedMs;
    if (this.record.isClockedIn && this.record.clockInTime) {
      totalMs += now.getTime() - new Date(this.record.clockInTime).getTime();
    }

    const grossMinutes = Math.floor(totalMs / 60000);
    this.grossHours = this.formatHoursMinutes(grossMinutes);

    const effectiveMinutes = grossMinutes - this.breakMinutes;
    this.effectiveHours = this.formatHoursMinutes(effectiveMinutes);

    this.timeSinceLastLogin = this.formatHMS(totalMs);
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
