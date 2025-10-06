import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const StatusRouter = Router();

// PUT: Accept candidate
StatusRouter.put("/accept", async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const [result]: any = await pool.query(
      `UPDATE candidates SET status = 'accepted' WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Candidate with id ${id} not found` });
    }

    res.json({ message: `Status updated to 'accepted' for candidate ${id}` });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT: Reject candidate
StatusRouter.put("/reject", async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const [result]: any = await pool.query(
      `UPDATE candidates SET status = 'rejected' WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Candidate with id ${id} not found` });
    }

    res.json({ message: `Status updated to 'rejected' for candidate ${id}` });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Get candidates by status (path param)
StatusRouter.get("/by-status/:status", async (req: Request, res: Response) => {
  const { status } = req.params;

  if (status !== "accepted" && status !== "rejected") {
    return res.status(400).json({ error: "Status must be either 'accepted' or 'rejected'" });
  }

  try {
    const [rows]: any = await pool.query(
      `SELECT * FROM candidates WHERE status = ?`,
      [status]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: `No candidates found with status '${status}'` });
    }

    res.json({ candidates: rows });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Get candidates by status (query param)
StatusRouter.get("/status", async (req: Request, res: Response) => {
  const status = req.query.status as string;

  try {
    let query = "SELECT id, status FROM candidates";
    const params: any[] = [];

    if (status) {
      if (status !== "accepted" && status !== "rejected") {
        return res.status(400).json({ error: "Status must be either 'accepted' or 'rejected'" });
      }
      query += " WHERE status = ?";
      params.push(status);
    }

    const [rows]: any = await pool.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No candidates found" });
    }

    res.json({ candidates: rows });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Get candidate by ID
StatusRouter.get("/id/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows]: any = await pool.query(
      `SELECT * FROM candidates WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: `Candidate with id ${id} not found` });
    }

    res.json({ candidate: rows[0] });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default StatusRouter;
