// src/routes/candidates/postRoutes.ts
import { Router, Request, Response } from "express";
import { pool } from "../../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const postAdminRouter = Router();

postAdminRouter.post("/admin", async (req: Request, res: Response) => {
  console.log("POST /admin called");

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { admin_users } = req.body;

    // Validate input
    if (!admin_users || !admin_users.Role || !admin_users.UserName || !admin_users.password) {
      await conn.rollback();
      return res.status(400).json({ error: "Role, UserName, and password are required" });
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(admin_users.password, 1);

    // Insert into admin_users table
    await conn.query(
      `INSERT INTO admin_users (Role, UserName, password) VALUES (?, ?, ?)`,
      [admin_users.Role, admin_users.UserName, admin_users.password]
    );

    await conn.commit();

    res.status(201).json({
      message: "Admin user created successfully",
      admin: {
        Role: admin_users.Role,
        UserName: admin_users.UserName,
      },
    });
  } catch (err: any) {
    await conn.rollback();
    console.error("Error creating admin user:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

export default postAdminRouter;
