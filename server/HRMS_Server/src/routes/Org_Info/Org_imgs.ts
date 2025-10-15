import express, { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { pool } from "../../config/database"; // ✅ Adjust this path to your config file

const postOrgInfoRouter = Router();

// Set up multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "image_org/"),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// ✅ POST route — upload + insert
postOrgInfoRouter.post("/uploads", upload.single("file"), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const imageUrl = `http://30.0.0.78:3562/uploads/${req.file.filename}`;
        console.log("🟢 Image URL:", imageUrl);

        const conn = await pool.getConnection();
        try {
            const [result]: any = await conn.query(
                "INSERT INTO organisation_info ( organisation_Logo) VALUES (?)",
                [imageUrl]
            );
            console.log("🟢 Insert result:", result);
            conn.release();

            return res.json({
                success: true,
                message: "File uploaded & saved to DB",
                imageUrl,
                insertedId: result.insertId,
            });
        } catch (dbErr) {
            conn.release();
            console.error("🔴 DB Insert Error:", dbErr);
            return res.status(500).json({ success: false, message: "DB insert failed", error: dbErr });
        }
    } catch (err: any) {
        console.error("🔴 Upload Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ Serve static uploads

export default postOrgInfoRouter;
