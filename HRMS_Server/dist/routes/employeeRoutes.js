"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
/* -------------------- CREATE candidate and JD -------------------- */
router.post("/jd", async (req, res) => {
    const conn = await database_1.pool.getConnection();
    try {
        const { personalDetails, jobDetailsForm } = req.body;
        await conn.beginTransaction();
        const [candidateResult] = await conn.query("INSERT INTO candidates VALUES ()");
        const candidateId = candidateResult.insertId;
        await conn.query(`INSERT INTO personal_details
       (candidate_id, FirstName, MiddleName, LastName, PhoneNumber, email, gender, initials)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            candidateId,
            personalDetails.FirstName,
            personalDetails.MiddleName,
            personalDetails.LastName,
            personalDetails.PhoneNumber,
            personalDetails.email,
            personalDetails.gender,
            personalDetails.initials,
        ]);
        await conn.query(`INSERT INTO job_details
       (candidate_id, JobTitle, Department, JobLocation, WorkType, BussinessUnit)
       VALUES (?, ?, ?, ?, ?, ?)`, [
            candidateId,
            jobDetailsForm.JobTitle,
            jobDetailsForm.Department,
            jobDetailsForm.JobLocation,
            jobDetailsForm.WorkType,
            jobDetailsForm.BussinessUnit,
        ]);
        await conn.commit();
        res
            .status(201)
            .json({ message: "Candidate created successfully", candidateId });
    }
    catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    }
    finally {
        conn.release();
    }
});
/* -------------------- CREATE Offer Details -------------------- */
router.post("/offer-details", async (req, res) => {
    const conn = await database_1.pool.getConnection();
    try {
        const { candidateId, offerDetails } = req.body;
        // Insert offer details
        await conn.query(`INSERT INTO offer_details
       (candidate_id, DOJ, offerValidity, JoiningDate)
       VALUES (?, ?, ?, ?)`, [
            candidateId,
            offerDetails.DOJ,
            offerDetails.offerValidity,
            offerDetails.JoiningDate,
        ]);
        await conn.commit();
        res
            .status(201)
            .json({ message: "Candidate created successfully", candidateId });
    }
    catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    }
    finally {
        conn.release();
    }
});
/* -------------------- CREATE candidate -------------------- */
router.post("/uhhb", async (req, res) => {
    const conn = await database_1.pool.getConnection();
    try {
        const { personalDetails, jobDetailsForm, offerDetails, employeeCredentials, } = req.body;
        await conn.beginTransaction();
        // Insert into candidates master table (auto id)
        const [candidateResult] = await conn.query("INSERT INTO candidates VALUES ()");
        const candidateId = candidateResult.insertId;
        // Insert personal details
        await conn.query(`INSERT INTO personal_details
       (candidate_id, FirstName, MiddleName, LastName, PhoneNumber, email, gender, initials)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            candidateId,
            personalDetails.FirstName,
            personalDetails.MiddleName,
            personalDetails.LastName,
            personalDetails.PhoneNumber,
            personalDetails.email,
            personalDetails.gender,
            personalDetails.initials,
        ]);
        // Insert job details
        await conn.query(`INSERT INTO job_details
       (candidate_id, JobTitle, Department, JobLocation, WorkType, BussinessUnit)
       VALUES (?, ?, ?, ?, ?, ?)`, [
            candidateId,
            jobDetailsForm.JobTitle,
            jobDetailsForm.Department,
            jobDetailsForm.JobLocation,
            jobDetailsForm.WorkType,
            jobDetailsForm.BussinessUnit,
        ]);
        // Insert offer details
        await conn.query(`INSERT INTO offer_details
       (candidate_id, DOJ, offerValidity, JoiningDate)
       VALUES (?, ?, ?, ?)`, [
            candidateId,
            offerDetails.DOJ,
            offerDetails.offerValidity,
            offerDetails.JoiningDate,
        ]);
        // Insert employee credentials
        await conn.query(`INSERT INTO employee_credentials
       (candidate_id, companyEmail, password)
       VALUES (?, ?, ?)`, [
            candidateId,
            employeeCredentials.companyEmail,
            employeeCredentials.password,
        ]);
        await conn.commit();
        res
            .status(201)
            .json({ message: "Candidate created successfully", candidateId });
    }
    catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    }
    finally {
        conn.release();
    }
});
/* -------------------- READ all candidates (nested) -------------------- */
router.get("/", async (req, res) => {
    const [rows] = await database_1.pool.query(`SELECT c.id,
            p.FirstName, p.MiddleName, p.LastName, p.PhoneNumber, p.email, p.gender, p.initials,
            j.JobTitle, j.Department, j.JobLocation, j.WorkType, j.BussinessUnit,
            o.DOJ, o.offerValidity, o.JoiningDate,
            e.companyEmail, e.password
     FROM candidates c
     LEFT JOIN personal_details p ON c.id = p.candidate_id
     LEFT JOIN job_details j ON c.id = j.candidate_id
     LEFT JOIN offer_details o ON c.id = o.candidate_id
     LEFT JOIN employee_credentials e ON c.id = e.candidate_id`);
    const formatted = rows.map((row) => ({
        id: row.id,
        personalDetails: {
            FirstName: row.FirstName,
            MiddleName: row.MiddleName,
            LastName: row.LastName,
            PhoneNumber: row.PhoneNumber,
            email: row.email,
            gender: row.gender,
            initials: row.initials,
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
    }));
    res.json(formatted);
});
/* -------------------- READ candidate by ID (nested) -------------------- */
router.get("/:id", async (req, res) => {
    const [rows] = await database_1.pool.query(`SELECT c.id,
            p.FirstName, p.MiddleName, p.LastName, p.PhoneNumber, p.email, p.gender, p.initials,
            j.JobTitle, j.Department, j.JobLocation, j.WorkType, j.BussinessUnit,
            o.DOJ, o.offerValidity, o.JoiningDate,
            e.companyEmail, e.password
     FROM candidates c
     LEFT JOIN personal_details p ON c.id = p.candidate_id
     LEFT JOIN job_details j ON c.id = j.candidate_id
     LEFT JOIN offer_details o ON c.id = o.candidate_id
     LEFT JOIN employee_credentials e ON c.id = e.candidate_id
     WHERE c.id = ?`, [req.params.id]);
    if (rows.length === 0)
        return res.status(404).send("Candidate not found");
    const row = rows[0];
    res.json({
        id: row.id,
        personalDetails: {
            FirstName: row.FirstName,
            MiddleName: row.MiddleName,
            LastName: row.LastName,
            PhoneNumber: row.PhoneNumber,
            email: row.email,
            gender: row.gender,
            initials: row.initials,
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
    });
});
/* -------------------- READ each section separately -------------------- */
router.get("/:id/personal", async (req, res) => {
    const [rows] = await database_1.pool.query("SELECT * FROM personal_details WHERE candidate_id = ?", [req.params.id]);
    res.json({ candidateId: req.params.id, personalDetails: rows[0] || {} });
});
router.get("/:id/job", async (req, res) => {
    const [rows] = await database_1.pool.query("SELECT * FROM job_details WHERE candidate_id = ?", [req.params.id]);
    res.json({ candidateId: req.params.id, jobDetailsForm: rows[0] || {} });
});
router.get("/:id/offer", async (req, res) => {
    const [rows] = await database_1.pool.query("SELECT * FROM offer_details WHERE candidate_id = ?", [req.params.id]);
    res.json({ candidateId: req.params.id, offerDetails: rows[0] || {} });
});
router.get("/:id/credentials", async (req, res) => {
    const [rows] = await database_1.pool.query("SELECT * FROM employee_credentials WHERE candidate_id = ?", [req.params.id]);
    res.json({ candidateId: req.params.id, employeeCredentials: rows[0] || {} });
});
/* -------------------- UPDATE parts separately -------------------- */
router.put("/:id/personal", async (req, res) => {
    const { id } = req.params;
    const { FirstName, MiddleName, LastName, PhoneNumber, email, gender, initials, } = req.body;
    try {
        await database_1.pool.query(`UPDATE personal_details
       SET FirstName=?, MiddleName=?, LastName=?, PhoneNumber=?, email=?, gender=?, initials=?
       WHERE candidate_id=?`, [
            FirstName,
            MiddleName,
            LastName,
            PhoneNumber,
            email,
            gender,
            initials,
            id,
        ]);
        res.json({ message: "Personal details updated successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put("/:id/job", async (req, res) => {
    const { id } = req.params;
    const { JobTitle, Department, JobLocation, WorkType, BussinessUnit } = req.body;
    try {
        await database_1.pool.query(`UPDATE job_details 
       SET JobTitle=?, Department=?, JobLocation=?, WorkType=?, BussinessUnit=? 
       WHERE candidate_id=?`, [JobTitle, Department, JobLocation, WorkType, BussinessUnit, id]);
        res.json({ message: "Job details updated successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put("/:id/offer", async (req, res) => {
    const { id } = req.params;
    const { DOJ, offerValidity, JoiningDate } = req.body;
    try {
        await database_1.pool.query(`UPDATE offer_details
       SET DOJ=?, offerValidity=?, JoiningDate=?
       WHERE candidate_id=?`, [DOJ, offerValidity, JoiningDate, id]);
        res.json({ message: "Offer details updated successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put("/:id/credentials", async (req, res) => {
    const { id } = req.params;
    const { companyEmail, password } = req.body;
    try {
        await database_1.pool.query(`UPDATE employee_credentials
       SET companyEmail=?, password=?
       WHERE candidate_id=?`, [companyEmail, password, id]);
        res.json({ message: "Employee credentials updated successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
/* -------------------- DELETE candidate -------------------- */
router.delete("/:id", async (req, res) => {
    const [result] = await database_1.pool.query("DELETE FROM candidates WHERE id=?", [
        req.params.id,
    ]);
    if (result.affectedRows === 0)
        return res.status(404).send("Candidate not found");
    res.send("Candidate deleted successfully");
});
exports.default = router;
//# sourceMappingURL=employeeRoutes.js.map