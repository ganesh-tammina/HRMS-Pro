// src/routes/Employees/employeeRoutes.ts
import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const employeeRouter = Router();

// POST /employees/:id
employeeRouter.post("/", async (req: Request, res: Response) => {
  const {id,
    firstName,
    lastName,
    email,
    MiddleName,
    PhoneNumber,
    gender,
    initials,
    JobTitle,
    Department,
    JobLocation,
    WorkType,
    BusinessUnit,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO employees
        (employee_id, firstName, lastName, email, MiddleName, PhoneNumber, gender, initials,
         JobTitle, Department, JobLocation, WorkType, BusinessUnit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        firstName,
        lastName,
        email,
        MiddleName,
        PhoneNumber,
        gender,
        initials,
        JobTitle,
        Department,
        JobLocation,
        WorkType,
        BusinessUnit,
      ]
    );

    res.status(201).json({
      message: "Employee inserted successfully",
      employee_id: id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

employeeRouter.post("/rejectedemployees", async (req: Request, res: Response) => {
  const {id,
    firstName,
    lastName,
    email,
    MiddleName,
    PhoneNumber,
    gender,
    initials,
    JobTitle,
    Department,
    JobLocation,
    WorkType,
    BusinessUnit,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO rejectedemployees
        (employee_id, firstName, lastName, email, MiddleName, PhoneNumber, gender, initials,
         JobTitle, Department, JobLocation, WorkType, BusinessUnit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        firstName,
        lastName,
        email,
        MiddleName,
        PhoneNumber,
        gender,
        initials,
        JobTitle,
        Department,
        JobLocation,
        WorkType,
        BusinessUnit,
      ]
    );

    res.status(201).json({
      message: "Employee inserted successfully",
      employee_id: id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET all employees
employeeRouter.get("/", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM employees");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET one employee by ID
employeeRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM employees WHERE employee_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default employeeRouter;

