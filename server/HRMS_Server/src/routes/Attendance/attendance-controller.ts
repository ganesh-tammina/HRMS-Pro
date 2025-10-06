import { Request, Response } from 'express';
import AttendanceService from './attendance-service';
import { TO, TT } from './attendance-interface';

export default class AttendanceController {
  public static async handleClockIn(req: Request, res: Response) {
    const { employee_id, check_in }: TT = req.body;
    if (!employee_id) {
      return res.status(400).json({ message: 'employee_id is required' });
    }
    if (typeof employee_id != 'number') {
      return res.status(400).json({ message: 'Not Valid Employee Number' });
    }
    try {
      const result = await AttendanceService.clockIn({
        employee_id,
        check_in,
      });
      res.json({ message: 'Clock-in successful', data: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  public static async handleClockOut(req: Request, res: Response) {
    const { employee_id, check_out }: TO = req.body;
    if (!employee_id) {
      return res.status(400).json({ message: 'employee_id is required' });
    }
    if (typeof employee_id != 'number') {
      return res.status(400).json({ message: 'Not Valid Employee Number' });
    }
    try {
      const result = await AttendanceService.clockOut({
        employee_id,
        check_out,
      });
      res.json({ message: 'Clock-in successful', data: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  public static async notinyet(req: Request, res: Response) {
    const result = await AttendanceService.notinyet();
    res.json({
      not_in: result,
      count: result.length,
    });
  }
}
