// src/routes/candidates/index.ts
import { Router } from "express";
import postRouter from "./employeePostRoutes";
import getRouter from "./EmployeeGetRoutes";
import putRouter from "./EmployeePutRoutes";
import deleteRouter from "./EmployeeDeleteRoutes";
import attendancePostRouter from "./attendance/attandancePostRoutes";
import attendanceGetRouter from "./attendance/attandanceGetRoutes";

const router = Router();

router.use(postRouter);
router.use(getRouter);
router.use(putRouter);
router.use(deleteRouter);
router.use(attendancePostRouter); // ✅ now mounted under /candidates
router.use(attendanceGetRouter); // ✅ now mounted under /candidates


export default router;
