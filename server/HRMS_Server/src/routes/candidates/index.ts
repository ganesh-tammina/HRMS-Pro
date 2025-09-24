// src/routes/candidates/index.ts
import { Router } from "express";
import postRouter from "./employeePostRoutes";
import getRouter from "./EmployeeGetRoutes";
import putRouter from "./EmployeePutRoutes";
import deleteRouter from "./EmployeeDeleteRoutes";

const router = Router();

router.use(postRouter);
router.use(getRouter);
router.use(putRouter);
router.use(deleteRouter);

export default router;
