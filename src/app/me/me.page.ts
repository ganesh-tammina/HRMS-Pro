import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, CommonModule]
})
export class MePage implements OnInit {

  clockInTime?: Date; // timestamp of last clock in
  accumulatedMs: number = 0; // total time accumulated across sessions
  isClockedIn: boolean = false;

  breakMinutes: number = 60;
  effectiveHours: string = '0h 0m';
  grossHours: string = '0h 0m';
  timeSinceLastLogin: string = '0h 0m 0s';

  currentTime: string = '';
  currentDate: string = '';

  constructor() { }

  ngOnInit() {
    // Load persisted state from localStorage
    const clockIn = localStorage.getItem('clockInTime');
    const accumulated = localStorage.getItem('accumulatedMs');
    const isRunning = localStorage.getItem('isClockedIn');

    if (clockIn) this.clockInTime = new Date(clockIn);
    if (accumulated) this.accumulatedMs = parseInt(accumulated, 10);
    this.isClockedIn = isRunning === 'true';

    // Start interval for live clock and timer
    this.updateTimes();
    setInterval(() => this.updateTimes(), 1000);
  }

  clockIn() {
    if (!this.isClockedIn) {
      this.clockInTime = new Date();
      this.isClockedIn = true;

      // Persist state
      localStorage.setItem('clockInTime', this.clockInTime.toISOString());
      localStorage.setItem('isClockedIn', 'true');

      alert(`Clocked in at ${this.clockInTime.toLocaleTimeString()}`);
    }
  }

  clockOut() {
    if (this.isClockedIn && this.clockInTime) {
      const now = new Date();
      this.accumulatedMs += now.getTime() - this.clockInTime.getTime();
      this.isClockedIn = false;

      // Persist state
      localStorage.setItem('accumulatedMs', this.accumulatedMs.toString());
      localStorage.setItem('isClockedIn', 'false');

      alert(`Clocked out at ${now.toLocaleTimeString()}`);
    }
  }

  updateTimes() {
    const now = new Date();

    // Live clock
    this.currentTime = now.toLocaleTimeString('en-US', { hour12: true });
    this.currentDate = now.toDateString();

    // Calculate total gross time
    const totalMs = this.accumulatedMs + (this.isClockedIn && this.clockInTime ? now.getTime() - this.clockInTime.getTime() : 0);
    const grossMinutes = Math.floor(totalMs / 60000);
    this.grossHours = this.formatHoursMinutes(grossMinutes);

    // Effective hours
    const effectiveMinutes = grossMinutes - this.breakMinutes;
    this.effectiveHours = this.formatHoursMinutes(effectiveMinutes);

    // Time Since Last Login / Clock In (pause/resume)
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
