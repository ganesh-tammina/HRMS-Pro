import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const getEmployyeeCredentialsRouter = Router();

getEmployyeeCredentialsRouter.get("/credentials/:id", async (_req: Request, res: Response) => {
    try {
        const [rows]: any = await pool.query(
            `SELECT 
                 ec.employee_id,   ec.companyEmail, ec.password
             FROM employees e
             JOIN employee_credentials ec 
               ON e.employee_id = ec.employee_id`
        );

        // Just return the list as is
        res.json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default getEmployyeeCredentialsRouter;