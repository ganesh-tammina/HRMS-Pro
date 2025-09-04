import { Injectable } from '@angular/core';

export interface AttendanceEvent {
  type: 'CLOCK_IN' | 'CLOCK_OUT';
  time: string;             // ISO string
  displayTime?: string;     // optional, for template display
}

export interface AttendanceRecord {
  employeeId: number;
  clockInTime?: string;
  accumulatedMs: number;
  isClockedIn: boolean;
  history: AttendanceEvent[];
  dailyAccumulatedMs?: { [date: string]: number }; // daily totals
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
    if (stored) {
      const parsed: AttendanceRecord = JSON.parse(stored);
      parsed.history ||= [];
      parsed.accumulatedMs ||= 0;
      parsed.isClockedIn ??= false;
      parsed.dailyAccumulatedMs ||= {};
      return parsed;
    }

    const initial: AttendanceRecord = {
      employeeId,
      accumulatedMs: 0,
      isClockedIn: false,
      history: [],
      dailyAccumulatedMs: {}
    };
    this.saveRecord(initial);
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
      record.history.push({ type: 'CLOCK_IN', time: record.clockInTime });

      const today = new Date().toDateString();
      record.dailyAccumulatedMs ||= {};
      record.dailyAccumulatedMs[today] ||= 0;

      this.saveRecord(record);
    }
    return record;
  }

  clockOut(employeeId: number): AttendanceRecord {
    let record = this.getRecord(employeeId);
    if (record.isClockedIn && record.clockInTime) {
      const now = new Date();
      const duration = now.getTime() - new Date(record.clockInTime).getTime();

      record.accumulatedMs += duration;

      const today = now.toDateString();
      record.dailyAccumulatedMs ||= {};
      record.dailyAccumulatedMs[today] ||= 0;
      record.dailyAccumulatedMs[today] += duration;

      record.isClockedIn = false;
      record.clockInTime = undefined;

      record.history.push({ type: 'CLOCK_OUT', time: now.toISOString() });

      this.saveRecord(record);
    }
    return record;
  }

  getHistoryByRange(
    record: AttendanceRecord,
    range: 'TODAY' | 'WEEK' | 'MONTH' | 'ALL'
  ): AttendanceEvent[] {
    const history = record.history || [];
    const now = new Date();

    return history.filter(event => {
      const eventDate = new Date(event.time);
      switch (range) {
        case 'TODAY':
          return eventDate.toDateString() === now.toDateString();
        case 'WEEK': {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          return eventDate >= weekStart && eventDate <= now;
        }
        case 'MONTH':
          return (
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getFullYear() === now.getFullYear()
          );
        default:
          return true;
      }
    });
  }
}
