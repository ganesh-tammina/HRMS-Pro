// src/routes/candidates/getRoutes.ts
import { Router, Request, Response } from "express";
import { pool } from "../../../config/database";

const getRouter = Router();

/* READ all candidates */
// GET /attendance/employee-attendance
getRouter.get("/employee-attendance", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT 
         c.id AS candidateId,
         a.attendance_id AS attendanceId,
         a.attendance_date,
         a.check_in,
         a.check_out,
         a.status,
         a.remarks
       FROM candidates c
       LEFT JOIN attendance a ON a.employee_id = c.id
       ORDER BY c.id, a.attendance_date`
    );

    // Group attendance by candidate
    const formatted: any = [];
    const map = new Map<number, any>();

    rows.forEach((row: any) => {
      if (!map.has(row.candidateId)) {
        map.set(row.candidateId, {
          candidateId: row.candidateId,
          attendanceRecords: [],
        });
      }
      if (row.attendanceId) {
        map.get(row.candidateId).attendanceRecords.push({
          attendanceId: row.attendanceId,
          attendance: {
            attendance_date: row.attendance_date,
            check_in: row.check_in,
            check_out: row.check_out,
            status: row.status,
            remarks: row.remarks,
          },
        });
      }
    });

    formatted.push(...map.values());

    res.json({ candidates: formatted });
  } catch (err: any) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: err.message });
  }
});


/* READ candidate by ID */


/* READ each section separately */




getRouter.get("/:id/offer-details", async (req: Request, res: Response) => {
    const [rows]: any = await pool.query("SELECT * FROM offer_details WHERE employee_id = ?", [req.params.id]);
    res.json({ candidateId: req.params.id, offerDetails: rows[0] || {} });
});


export default getRouter;
