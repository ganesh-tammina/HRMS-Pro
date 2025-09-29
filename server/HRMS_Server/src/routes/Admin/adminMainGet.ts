// src/routes/candidates/getRoutes.ts
import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const getAdminRouter = Router();


getAdminRouter.get("/:admin_id/admin", async (req: any, res: Response) => {
  try {
    const adminId = req.params.admin_id; // dynamic

    const [rows]: any = await pool.query(
      "SELECT * FROM admin_users WHERE admin_id = ?", // replace 'id' with your column name if different
      [adminId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching admin:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default getAdminRouter;