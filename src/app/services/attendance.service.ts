import { Injectable } from '@angular/core';

export interface AttendanceRecord {
  employeeId: number;
  lastClockInTime?: string;   // most recent clock-in
  lastClockOutTime?: string;  // most recent clock-out
  accumulatedMsToday: number; // accumulated milliseconds for today
  isClockedIn: boolean;
  lastClockDate?: string;     // date of the last clock-in
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private prefix = 'attendance_';

  private getKey(employeeId: number): string {
    return `${this.prefix}${employeeId}`;
  }

  getRecord(employeeId: number): AttendanceRecord {
    const stored = localStorage.getItem(this.getKey(employeeId));
    if (stored) return JSON.parse(stored);

    const initial: AttendanceRecord = {
      employeeId,
      accumulatedMsToday: 0,
      isClockedIn: false
    };
    localStorage.setItem(this.getKey(employeeId), JSON.stringify(initial));
    return initial;
  }

  saveRecord(record: AttendanceRecord) {
    localStorage.setItem(this.getKey(record.employeeId), JSON.stringify(record));
  }

  clockIn(employeeId: number): AttendanceRecord {
    const record = this.getRecord(employeeId);
    const today = new Date().toISOString().split('T')[0];

    if (record.lastClockDate !== today) {
      // New day: reset today's accumulated time
      record.accumulatedMsToday = 0;
      record.isClockedIn = false;
      record.lastClockInTime = undefined;
      record.lastClockOutTime = undefined;
    }

    if (!record.isClockedIn) {
      const now = new Date().toISOString();
      record.lastClockInTime = now;
      record.isClockedIn = true;
      record.lastClockDate = today;
      this.saveRecord(record);
    }

    return record;
  }

  clockOut(employeeId: number): AttendanceRecord {
    const record = this.getRecord(employeeId);
    const today = new Date().toISOString().split('T')[0];

    if (record.isClockedIn && record.lastClockInTime) {
      const now = new Date();
      const clockInTime = new Date(record.lastClockInTime).getTime();
      record.accumulatedMsToday += now.getTime() - clockInTime;
      record.isClockedIn = false;
      record.lastClockOutTime = now.toISOString();
      record.lastClockDate = today;
      record.lastClockInTime = undefined;
      this.saveRecord(record);
    }

    return record;
  }
}
