import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const EmpStatusRouter = Router();

// PUT: Accept candidate
EmpStatusRouter.put("/hire", async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const [result]: any = await pool.query(
      `UPDATE candidates SET status = 'hired' WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Candidate with id ${id} not found` });
    }

    res.json({ message: `Status updated to 'hired' for candidate ${id}` });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// PUT: Accept candidate
EmpStatusRouter.put("/hold", async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const [result]: any = await pool.query(
      `UPDATE candidates SET status = 'hold' WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Candidate with id ${id} not found` });
    }

    res.json({ message: `Status updated to 'hold' for candidate ${id}` });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default EmpStatusRouter;