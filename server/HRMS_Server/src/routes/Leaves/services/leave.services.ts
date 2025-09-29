import { pool } from '../../../config/database';

interface LeaveBalance {
  candidate_id: number;
  leave_year_start: string;
  leave_year_end: string;
  casual_leave_allocated?: number;
  marriage_leave_allocated?: number;
  comp_offs_allocated?: number;
  medical_leave_allocated?: number;
  paid_leave_allocated?: number;
}

interface LeaveRequest {
  candidate_id: number;
  leave_type: 'CASUAL' | 'MARRIAGE' | 'COMP_OFF' | 'MEDICAL' | 'PAID';
  start_date: string;
  end_date: string;
  total_days: number;
  remarks?: string;
}

export const createLeaveBalance = async (data: LeaveBalance) => {
  const [rows] = await pool.query(
    `INSERT INTO leave_balance (candidate_id, leave_year_start, leave_year_end, casual_leave_allocated, marriage_leave_allocated, comp_offs_allocated, medical_leave_allocated, paid_leave_allocated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.candidate_id,
      data.leave_year_start,
      data.leave_year_end,
      data.casual_leave_allocated || 0,
      data.marriage_leave_allocated || 0,
      data.comp_offs_allocated || 0,
      data.medical_leave_allocated || 0,
      data.paid_leave_allocated || 0,
    ]
  );
  return rows;
};

export const createLeaveRequest = async (data: LeaveRequest) => {
  const [rows] = await pool.query(
    `INSERT INTO leave_requests (candidate_id, leave_type, start_date, end_date, total_days, remarks) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.candidate_id,
      data.leave_type,
      data.start_date,
      data.end_date,
      data.total_days,
      data.remarks || null,
    ]
  );
  return rows;
};
export const getLeaveBalances = async () => {
  const [rows] = await pool.query('SELECT * FROM leave_balance');
  return rows;
};
export const getLeaveRequests = async () => {
  const [rows] = await pool.query('SELECT * FROM leave_requests');
  return rows;
};
