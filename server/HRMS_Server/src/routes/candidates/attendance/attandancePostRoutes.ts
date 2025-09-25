// src/routes/candidates/postRoutes.ts
import { Router, Request, Response } from "express";
import { pool } from "../../../config/database";

const postRouter = Router();


/* CREATE Offer Details */
postRouter.post("/employee-attendance", async (req: Request, res: Response) => {
  console.log("POST /employee-attendance called");
  console.log("REQ.BODY:", req.body);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { candidateId, attendance } = req.body;

    if (!candidateId) {
      await conn.rollback();
      return res.status(400).json({ error: "candidateId is required" });
    }

    if (
      !attendance ||
      !attendance.attendance_date ||
      !attendance.check_in ||
      !attendance.check_out ||
      !attendance.status
    ) {
      await conn.rollback();
      return res.status(400).json({ error: "attendance details are required" });
    }

    // Check if candidate exists
    const [candidateRows]: any = await conn.query(
      "SELECT id FROM candidates WHERE id = ?",
      [candidateId]
    );

    if (candidateRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: `Candidate with id ${candidateId} does not exist` });
    }

    // Generate custom attendance_id: YYYYMMDD_candidateId
    // Generate custom attendance_id: YYYY-MM-DD_candidateId
    const attendanceId = `${attendance.attendance_date}_${candidateId}`;


    // Insert attendance record
    await conn.query(
      `INSERT INTO attendance
       (attendance_id, candidate_id, attendance_date, check_in, check_out, status, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        attendanceId,
        candidateId,
        attendance.attendance_date,
        attendance.check_in,
        attendance.check_out,
        attendance.status,
        attendance.remarks || null,
      ]
    );

    await conn.commit();

    res.status(201).json({
      message: "Attendance created successfully",
      candidateId,
      attendanceId,
      attendance,
    });
  } catch (err: any) {
    await conn.rollback();
    console.error("Error creating attendance:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});













export default postRouter;
