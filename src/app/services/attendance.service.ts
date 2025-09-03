import { Injectable } from '@angular/core';

export interface AttendanceRecord {
  employeeId: number;
  clockInTime?: string;
  accumulatedMs: number;
  isClockedIn: boolean;
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
      accumulatedMs: 0,
      isClockedIn: false
    };
    localStorage.setItem(this.getKey(employeeId), JSON.stringify(initial));
    return initial;
  }

  saveRecord(record: AttendanceRecord) {
    localStorage.setItem(this.getKey(record.employeeId), JSON.stringify(record));
  }

  clockIn(employeeId: number): AttendanceRecord {
    let record = this.getRecord(employeeId);
    if (!record.isClockedIn) {
      record.clockInTime = new Date().toISOString();
      record.isClockedIn = true;
      this.saveRecord(record);
    }
    return record;
  }

  clockOut(employeeId: number): AttendanceRecord {
    let record = this.getRecord(employeeId);
    if (record.isClockedIn && record.clockInTime) {
      const now = new Date();
      record.accumulatedMs += now.getTime() - new Date(record.clockInTime).getTime();
      record.isClockedIn = false;
      record.clockInTime = undefined;
      this.saveRecord(record);
    }
    return record;
  }
}
