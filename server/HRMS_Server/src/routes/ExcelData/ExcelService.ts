import xlsx, { WorkBook, WorkSheet } from "xlsx";
import { Request, Response } from "express";
export class ExcelService {
    public static async bp(req: Request, res: Response) {
        try {
            if (!req.file) return res.status(400).send("No file uploaded");

            const workbook: WorkBook = xlsx.readFile(req.file.path);
            const worksheet: WorkSheet = workbook.Sheets;

            const sheetData = await new Promise<any[]>((resolve, reject) => {
                setImmediate(() => {
                    try {
                        const data = xlsx.utils.sheet_to_json(worksheet.Sheet1);
                        resolve(data);
                    } catch (error: any) {
                        reject(new Error(`Failed to parse sheet: ${error.message}`));
                    }
                });
            });

            console.log(sheetData);
            return res.json(sheetData); // Send response; adjust if this isn't the intent
        } catch (error: any) {
            console.error(error); // Log for debugging
            return res.status(500).json({ error: `Failed to process Excel file: ${error.message}` });
        }
    }
}