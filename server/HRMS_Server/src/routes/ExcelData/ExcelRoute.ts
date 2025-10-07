import express from 'express';
import multer from 'multer';
import { ExcelController } from './excelcontoller';
import { Request, Response } from 'express';
import { ExcelService } from './ExcelService';
// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post('/excel', upload.single('file'), ExcelController.getColumnCount)

export default router; 