import express, { Router, Request, Response } from "express";
import multer from "multer";
import xlsx, { WorkBook, WorkSheet } from "xlsx";
import { pool } from "../../config/database";

const existingEmployeesRouter = Router();
const upload = multer({ dest: "uploads/" });

existingEmployeesRouter.post("/existingemployees", upload.single("file"), async (req: Request, res: Response) => {
    console.log("askjhkj");

    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        // Read the uploaded Excel file
        const workbook: WorkBook = xlsx.readFile(req.file.path);
        const worksheet: WorkSheet = workbook.Sheets;
        const sheetData = xlsx.utils.sheet_to_json(worksheet.Sheet1);

        for (const row of sheetData as any[]) {
            const {
                employeeId,
                firstName,
                MiddleName,
                lastName,
                Company_email,
                PhoneNumber,
                gender,
                initials,
                JobTitle,
                Department,
                JobLocation,
                WorkType,
                BusinessUnit,
                personalEmail,
                Address
            } = row;
            console.log(employeeId);
            await pool.query(
                `INSERT INTO employees 
                    (employee_id, firstName, middleName, lastName, email, phoneNumber, gender, jobTitle, Department, jobLocation, WorkType, BusinessUnit, personalEmail, address) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
                [
                    employeeId,
                    firstName,
                    MiddleName,
                    lastName,
                    Company_email,
                    PhoneNumber,
                    gender,
                    JobTitle,
                    Department,
                    JobLocation,
                    WorkType,
                    BusinessUnit,
                    personalEmail,
                    Address
                ]
            );
        }

        res.json(sheetData);
    } catch (error) {
        console.error("Error uploading employees:", error);
        res.status(500).send("Server error");
    }
});

export default existingEmployeesRouter;
