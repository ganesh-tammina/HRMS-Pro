import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const getEmployeesRouter = Router();



getEmployeesRouter.get("/", async (req: Request, res: Response) => {
    const [rows]: any = await pool.query(`
            SELECT 
                e.employee_id AS id,
                pd.FirstName,
                pd.MiddleName,
                pd.lastName,
                pd.PhoneNumber,
                pd.gender,

                jd.JobTitle,
                e.Department,
                jd.JobLocation,
                jd.WorkType,
                e.Companyemail,

                od.DOJ,
                od.offerValidity,
                od.JoiningDate,

                ec.companyEmail,
                ec.password,

                pk.annualSalary,
                pk.basic,
                pk.hra,
                pk.medical,
                pk.transport,
                pk.special,
                pk.subtotal,
                pk.pfEmployer,
                pk.pfEmployee,
                pk.total

            FROM employees e
            LEFT JOIN personal_details pd ON e.employee_id = pd.employee_id
            LEFT JOIN job_details jd ON e.employee_id = jd.employee_id
            LEFT JOIN offer_details od ON e.employee_id = od.employee_id
            LEFT JOIN employee_credentials ec ON e.employee_id = ec.employee_id
            LEFT JOIN packagedetails pk ON e.employee_id = pk.employee_id
            ORDER BY e.employee_id ASC;
        `);

    // 7️⃣ Format JSON
    const formatted = rows.map((row: any) => ({
        id: row.id,
        personalDetails: {
            firstName: row.firstName,
            MiddleName: row.MiddleName,
            lastName: row.lastName,
            PhoneNumber: row.PhoneNumber,
            gender: row.gender,
        },
        jobDetailsForm: {
            JobTitle: row.JobTitle,
            Department: row.Department,
            JobLocation: row.JobLocation,
            WorkType: row.WorkType,
            companyEmail: row.Companyemail
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
})
export default getEmployeesRouter;
