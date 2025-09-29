import express from "express";
import { Router, Request, Response } from "express";
import multer from "multer";
import xlsx from "xlsx";
import { pool } from "../../config/database";

const postHolidaysRouter = Router();
const upload = multer({ dest: "uploads/" });

postHolidaysRouter.post("/upload-holidays", upload.single("file"), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Read Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];

        // Convert sheet to JSON (array of arrays)
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        if (sheetData.length < 2) {
            return res.status(400).json({ error: "Excel sheet is empty or missing data" });
        }

        // Extract headers and trim spaces
        const headers: string[] = sheetData[0].map((h: string) => h.toString().trim());
        const rows = sheetData.slice(1).map((row: any[]) => {
            const obj: any = {};
            headers.forEach((h, i) => (obj[h] = row[i]));
            return obj;
        });

        // Insert into MySQL
        for (const row of rows) {
            await pool.query(
                "INSERT INTO public_holidays (id, holiday_date, name, day, description) VALUES (?, ?, ?, ?, ?)",
                [row.ID, row.Date, row["Holiday Name"], row.Day, row.Description || ""]
            );
        }

        res.json({ message: "Holidays uploaded successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
});

export default postHolidaysRouter;


