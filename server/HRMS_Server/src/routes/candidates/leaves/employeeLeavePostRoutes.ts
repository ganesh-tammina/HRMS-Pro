// src/routes/candidates/postRoutes.ts
import { Router, Request, Response } from "express";
import { pool } from "../../../config/database";

const postRouter = Router();

/* CREATE candidate and JD */
postRouter.post("/sickleaves", async (req: Request, res: Response) => {
  const conn = await pool.getConnection();
  try {
    const { personalDetails, jobDetailsForm } = req.body;
    await conn.beginTransaction();
    const [candidateResult]: any = await conn.query("INSERT INTO candidates VALUES ()");
    const candidateId = candidateResult.insertId;

    await conn.query(
      `INSERT INTO personal_details
       (candidate_id, FirstName, MiddleName, LastName, PhoneNumber, email, gender, initials)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        candidateId,
        personalDetails.FirstName,
        personalDetails.MiddleName,
        personalDetails.LastName,
        personalDetails.PhoneNumber,
        personalDetails.email,
        personalDetails.gender,
        personalDetails.initials,
      ]
    );

    await conn.query(
      `INSERT INTO job_details
       (candidate_id, JobTitle, Department, JobLocation, WorkType, BussinessUnit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        candidateId,
        jobDetailsForm.JobTitle,
        jobDetailsForm.Department,
        jobDetailsForm.JobLocation,
        jobDetailsForm.WorkType,
        jobDetailsForm.BussinessUnit,
      ]
    );

    await conn.commit();
    res.status(201).json({ message: "Candidate created successfully", candidateId });
  } catch (err: any) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

/* CREATE Offer Details */




export default postRouter;
