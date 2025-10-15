import express from "express";
import { Router, Request, Response } from "express";
import multer from "multer";
import xlsx, { WorkBook, WorkSheet } from "xlsx";
import { pool } from "../../config/database";

const postHolidaysRouter = Router();
const upload = multer({ dest: "uploads/" });

postHolidaysRouter.post("/public_holidays", upload.single("file"), async (req: Request, res: Response) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        const workbook: WorkBook = xlsx.readFile(req.file.path);
        const worksheet: WorkSheet = workbook.Sheets;
        const sheetData = xlsx.utils.sheet_to_json(worksheet.Sheet1);
        for (const row of sheetData as any[]) {
            const { ID, Date, HolidayName, Day, Description } = row;
            console.log(ID, Date, HolidayName, Day, Description);
            await pool.query(
                "INSERT INTO public_holidays (ID, Date, HolidayName, Day, Description) VALUES (?, ?, ?, ?, ?)",
                [ID, Date, HolidayName, Day, Description]
            );
        }
        // console.log(sheetData);

        res.json({ message: sheetData });
    } catch (error) {
        console.error("Error uploading holidays:", error);
        res.status(500).send("Server error");
    }
});


postHolidaysRouter.get("/public_holidays", async (req: Request, res: Response) => {
    try {
        const [rows]: any = await pool.query("SELECT * FROM public_holidays ORDER BY Date ASC");
        res.json({
            success: true,
            count: rows.length,
            data: rows,
        });
    } catch (error) {
        console.error("Error fetching holidays:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default postHolidaysRouter;


