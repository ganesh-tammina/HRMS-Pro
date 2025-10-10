import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { Request, Response } from "express";
import fs from "fs";
const postOrgInfoRouter = Router();

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// POST /upload
postOrgInfoRouter.post('/uploads', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    // Return URL of uploaded image
    const imageUrl = `http://30.0.0.78:3562/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});


postOrgInfoRouter.get("/uploads", (req: Request, res: Response) => {
    const directoryPath = path.join(__dirname, "../../../uploads");

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Unable to scan uploads folder" });
        }

        const imageUrls = files.map((file) => `http://30.0.0.78:3562/uploads/${file}`);
        res.json({ success: true, images: imageUrls });
    });
});

export default postOrgInfoRouter;
