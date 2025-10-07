import { Request, Response } from 'express';
import { ExcelService } from './ExcelService';

export class ExcelController {

    public static async getColumnCount(req: Request, res: Response): Promise<void> {
        console.log("asdasdf")
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }

            const columnCount = await ExcelService.bp(req, res);
            res.status(200).json(columnCount);
        } catch (error) {
            console.error('Error processing Excel file:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}