// src/routes/candidates/postRoutes.ts
import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const postRouter = Router();

/* CREATE candidate and JD */
postRouter.post("/jd", async (req: Request, res: Response) => {
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
postRouter.post("/offer-details", async (req: Request, res: Response) => {
  console.log("POST /offer-details called");

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { candidateId, offerDetails } = req.body;

    // Validate input
    if (!candidateId) {
      await conn.rollback();
      return res.status(400).json({ error: "candidateId is required" });
    }

    if (!offerDetails || !offerDetails.DOJ || !offerDetails.offerValidity) {
      await conn.rollback();
      return res.status(400).json({ error: "offerDetails, DOJ, and offerValidity are required" });
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

    // Insert offer details
    await conn.query(
      `INSERT INTO offer_details
       (candidate_id, DOJ, offerValidity, JoiningDate)
       VALUES (?, ?, ?, ?)`,
      [
        candidateId,
        offerDetails.DOJ,
        offerDetails.offerValidity,
        offerDetails.JoiningDate || null, // optional
      ]
    );

    await conn.commit();

    res.status(201).json({
      message: "Offer details created successfully",
      candidateId,
      offerDetails,
    });
  } catch (err: any) {
    await conn.rollback();
    console.error("Error creating offer details:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});




postRouter.post("/package-details", async (req: Request, res: Response) => {
  console.log("POST /package-details called");

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { candidateId, packageDetails } = req.body;

    // Validate input
    if (!candidateId) {
      await conn.rollback();
      return res.status(400).json({ error: "candidateId is required" });
    }

    if (!packageDetails || !packageDetails.annualSalary) {
      await conn.rollback();
      return res.status(400).json({ error: "package Details and annualSalary are required" });
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

    // Insert offer details
    await conn.query(
      `INSERT INTO packagedetails
       (candidate_id, annualSalary,basic,hra,medical,transport,special,subtotal,pfEmployer,pfEmployee,total)
       VALUES (?, ?, ?, ?,?,?,?,?,?,?,?)`,
      [
        candidateId,
        packageDetails.annualSalary,
        packageDetails.basic,
        packageDetails.hra,
        packageDetails.medical,
        packageDetails.transport,
        packageDetails.special,
        packageDetails.subtotal,
        packageDetails.pfEmployee,
        packageDetails.pfEmployer,
        packageDetails.total,
      ]
    );

    await conn.commit();

    res.status(201).json({
      message: "PACKAGE created successfully",
      candidateId,
      packageDetails,
    });
  } catch (err: any) {
    await conn.rollback();
    console.error("Error creating offer details:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});





/* CREATE candidate (full) */
postRouter.post("/udd", async (req: Request, res: Response) => {
  const conn = await pool.getConnection();
  try {
    const { personalDetails, jobDetailsForm, offerDetails, employeeCredentials } = req.body;
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

    await conn.query(
      `INSERT INTO offer_details
       (candidate_id, DOJ, offerValidity, JoiningDate)
       VALUES (?, ?, ?, ?)`,
      [
        candidateId,
        offerDetails.DOJ,
        offerDetails.offerValidity,
        offerDetails.JoiningDate,
      ]
    );

    await conn.query(
      `INSERT INTO employee_credentials
       (candidate_id, companyEmail, password)
       VALUES (?, ?, ?)`,
      [
        candidateId,
        employeeCredentials.companyEmail,
        employeeCredentials.password,
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

export default postRouter;
