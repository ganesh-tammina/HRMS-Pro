import { Request, Response, Router } from "express";
import { pool } from "../../config/database";

const HolidaysPutRouter = Router();

// ✅ PUT route to update a public holiday
HolidaysPutRouter.put("/public_holidays/update", async (req: Request, res: Response) => {
    try {
        const { id, holiday_name, day, date, description } = req.body;

        // Validate required ID
        if (!id) {
            return res.status(400).json({ message: "Holiday ID is required" });
        }

        // Build dynamic query parts
        const updates: string[] = [];
        const values: any[] = [];

        if (holiday_name !== undefined) {
            updates.push("HolidayName = ?");
            values.push(holiday_name);
        }
        if (day !== undefined) {
            updates.push("Day = ?");
            values.push(day);
        }
        if (date !== undefined) {
            updates.push("Date = ?");
            values.push(date);
        }
        if (description !== undefined) {
            updates.push("Description = ?");
            values.push(description);
        }

        // If no fields to update
        if (updates.length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        // Final query
        const sql = `UPDATE public_holidays SET ${updates.join(", ")} WHERE ID = ?`;
        values.push(id);

        const [result]: any = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Holiday not found" });
        }

        res.status(200).json({ message: "Holiday updated successfully" });
    } catch (error) {
        console.error("Error updating holiday:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default HolidaysPutRouter;
