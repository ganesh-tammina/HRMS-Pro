import { pool } from '../../config/database';
import { TO, TT } from './attendance-interface';

export default class AttendanceService {
  public static async clockIn(data: TT) {
    try {
      const query = `
        INSERT INTO attendance (employee_id, attendance_date, check_in)
        VALUES (?, CURDATE(), ?)
      `;
      const [result] = await pool.query(query, [
        data.employee_id,
        data.check_in,
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  }
  public static async clockOut(data: TO) {
    const [ifIn]: any = await pool.query(
      `select count(*) as count from attendance where attendance_date = curdate() and employee_id = ?`,
      [data.employee_id]
    );
    if (ifIn[0].count === 1) {
      try {
        const query = `
        Update attendance set check_out = ?
       where employee_id = ?
      `;
        const [result] = await pool.query(query, [
          data.check_out,
          data.employee_id,
        ]);
        return result;
      } catch (err) {
        throw err;
      }
    } else {
      return 'Not Allowed, contact system Admin.';
    }
  }
  public static async notinyet() {
    const [all_Candidates]: any = await pool.query(
      "select id from candidates where status = 'accepted'"
    );
    const [in_candidates]: any = await pool.query(
      'select employee_id from attendance where attendance_date = curdate()'
    );
    const inCandidateIds = new Set(
      in_candidates.map((c: any) => c.employee_id)
    );
    
    const notCheckedIn = all_Candidates.filter(
      (candidate: any) => !inCandidateIds.has(candidate.id)
    );
    return notCheckedIn;
  }
}
