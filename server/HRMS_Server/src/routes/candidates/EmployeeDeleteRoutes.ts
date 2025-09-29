// src/routes/candidates/deleteRoutes.ts
import { Router, Request, Response } from "express";
import { pool } from "../../config/database";

const deleteRouter = Router();

deleteRouter.delete("/:id", async (req: Request, res: Response) => {
  const [result]: any = await pool.query("DELETE FROM candidates WHERE id=?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).send("Candidate not found");
  res.send("Candidate deleted successfully");
});

export default deleteRouter;

