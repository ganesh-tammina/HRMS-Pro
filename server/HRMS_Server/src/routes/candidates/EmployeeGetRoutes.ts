// src/routes/candidates/getRoutes.ts
import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const getRouter = Router();

/* READ all candidates */
getRouter.get("/", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query(
    `SELECT c.id,
            c.status,
            p.firstName, p.MiddleName, p.LastName, p.PhoneNumber, p.email, p.gender,
            j.JobTitle, j.Department, j.JobLocation, j.WorkType, j.BussinessUnit,
            o.DOJ, o.offerValidity, o.JoiningDate,
            e.companyEmail, e.password,m.annualSalary,m.basic,m.hra,m.medical,m.transport,m.special,m.subtotal,m.pfEmployer,m.pfEmployee,m.total
     FROM candidates c
     LEFT JOIN personal_details p ON c.id = p.employee_id
     LEFT JOIN job_details j ON c.id = j.employee_id
     LEFT JOIN offer_details o ON c.id = o.employee_id
     LEFT JOIN employee_credentials e ON c.id = e.employee_id
     LEFT JOIN packagedetails m ON c.id = m.employee_id`
  );
  const formatted = rows.map((row: any) => ({
    id: row.id,
    status: row.status,
    personalDetails: {
      FirstName: row.firstName,
      MiddleName: row.MiddleName,
      LastName: row.LastName,
      PhoneNumber: row.PhoneNumber,
      email: row.email,
      gender: row.gender,
    },
    jobDetailsForm: {
      JobTitle: row.JobTitle,
      Department: row.Department,
      JobLocation: row.JobLocation,
      WorkType: row.WorkType,
      BussinessUnit: row.BussinessUnit,
    },
    offerDetails: {
      DOJ: row.DOJ,
      offerValidity: row.offerValidity,
      JoiningDate: row.JoiningDate,
    },
    employeeCredentials: {
      companyEmail: row.companyEmail,
      password: row.password,
    },
    packageDetails: {
      annualSalary: row.annualSalary,
      basic: row.basic,
      hra: row.hra,
      medical: row.medical,
      transport: row.transport,
      special: row.special,
      subtotal: row.subtotal,
      pfEmployer: row.pfEmployer,
      pfEmployee: row.pfEmployee,
      total: row.total,
    },
  }));
  res.json({ candidates: formatted });
});

/* READ candidate by ID */
getRouter.get("/:id", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query(
    `SELECT c.id,
            p.FirstName, p.MiddleName, p.LastName, p.PhoneNumber, p.email, p.gender,
            j.JobTitle, j.Department, j.JobLocation, j.WorkType, j.BussinessUnit,
            o.DOJ, o.offerValidity, o.JoiningDate,
            e.companyEmail, e.password
     FROM candidates c
     LEFT JOIN personal_details p ON c.id = p.employee_id
     LEFT JOIN job_details j ON c.id = j.employee_id
     LEFT JOIN offer_details o ON c.id = o.employee_id
     LEFT JOIN employee_credentials e ON c.id = e.employee_id
     WHERE c.id = ?`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).send("Candidate not found");
  res.json(rows[0]);
});

/* READ each section separately */
getRouter.get("/:id/personal", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query("SELECT * FROM personal_details WHERE employee_id = ?", [req.params.id]);
  res.json({ candidateId: req.params.id, personalDetails: rows[0] || {} });
});

getRouter.get("/:id/job", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query("SELECT * FROM job_details WHERE employee_id = ?", [req.params.id]);
  res.json({ candidateId: req.params.id, jobDetailsForm: rows[0] || {} });
});

getRouter.get("/:id/offer-details", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query("SELECT * FROM offer_details WHERE employee_id = ?", [req.params.id]);
  res.json({ candidateId: req.params.id, offerDetails: rows[0] || {} });
});

getRouter.get("/:id/offer-details", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query("SELECT * FROM offer_details WHERE employee_id = ?", [req.params.id]);
  res.json({ candidateId: req.params.id, offerDetails: rows[0] || {} });
});

getRouter.get("/:id/package-details", async (req: Request, res: Response) => {
  const [rows]: any = await pool.query("SELECT * FROM packagedetails WHERE employee_id = ?", [req.params.id]);
  res.json({ candidateId: req.params.id, employeeCredentials: rows[0] || {} });
});

export default getRouter;
