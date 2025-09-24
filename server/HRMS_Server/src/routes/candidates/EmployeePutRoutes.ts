// src/routes/candidates/putRoutes.ts
import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const putRouter = Router();

/* UPDATE personal */
putRouter.put("/:id/personal", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { FirstName, MiddleName, LastName, PhoneNumber, email, gender, initials } = req.body;
  try {
    await pool.query(
      `UPDATE personal_details
       SET FirstName=?, MiddleName=?, LastName=?, PhoneNumber=?, email=?, gender=?, initials=?
       WHERE candidate_id=?`,
      [FirstName, MiddleName, LastName, PhoneNumber, email, gender, initials, id]
    );
    res.json({ message: "Personal details updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE job */
putRouter.put("/:id/job", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { JobTitle, Department, JobLocation, WorkType, BussinessUnit } = req.body;
  try {
    await pool.query(
      `UPDATE job_details
       SET JobTitle=?, Department=?, JobLocation=?, WorkType=?, BussinessUnit=?
       WHERE candidate_id=?`,
      [JobTitle, Department, JobLocation, WorkType, BussinessUnit, id]
    );
    res.json({ message: "Job details updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE offer */
putRouter.put("/offer-details", async (req: Request, res: Response) => {
  const { DOJ, offerValidity, JoiningDate, id } = req.body;
  try {
    await pool.query(
      `UPDATE offer_details
       SET DOJ=?, offerValidity=?, JoiningDate=?
       WHERE candidate_id=?`,
      [DOJ, offerValidity, JoiningDate, id]
    );
    res.json({ message: "Offer details updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


putRouter.put("/package-details", async (req: Request, res: Response) => {
  const { annualSalary, basic, hra, medical, transport, special, subtotal, pfEmployer, pfEmployee, total, id } = req.body;
  try {
    await pool.query(
      `UPDATE packagedetails
       SET annualSalary=?, basic=?, hra=?, medical=?, transport=?, special=?, subtotal=?, pfEmployer=?, pfEmployee=?, total=?
       WHERE candidate_id=?`,
      [annualSalary, basic, hra, medical, transport, special, subtotal, pfEmployer, pfEmployee, total, id]
    );
    res.json({ message: "package details updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});



/* UPDATE credentials */
putRouter.put("/:id/credentials", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { companyEmail, password } = req.body;
  try {
    await pool.query(
      `UPDATE employee_credentials
       SET companyEmail=?, password=?
       WHERE candidate_id=?`,
      [companyEmail, password, id]
    );
    res.json({ message: "Employee credentials updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

putRouter.put("/test", async (req: Request, res: Response) => {

  console.log("test");

})

export default putRouter;
