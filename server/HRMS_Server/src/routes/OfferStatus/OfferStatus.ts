
import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const StatusPutRouter = Router();

StatusPutRouter.put("/accept", async (req: Request, res: Response) => {
  const {id} = req.body;

  try {
    await pool.query(
      `UPDATE candidates 
       SET status = 'accepted' 
       WHERE id = ?`,
      [id]   
    );

    res.json({ message: `Status updated to 'accepted' for candidate ${id}` });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Server error" });
  }
});
StatusPutRouter.put("/reject", async (req: Request, res: Response) => {
  const { id} = req.body;

  try {
    await pool.query(
      `UPDATE candidates 
       SET status = 'rejected' 
       WHERE id = ?`,
      [id]   
    );

    res.json({ message: `Status updated to 'rejected' for candidate ${id}` });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Server error" });
  }
});
export default StatusPutRouter;