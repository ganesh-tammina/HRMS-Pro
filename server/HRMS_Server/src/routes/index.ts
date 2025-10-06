// src/routes/candidates/index.ts
import { Router } from 'express';
import postRouter from './Candidates/employeePostRoutes';
import getRouter from './Candidates/EmployeeGetRoutes';
import putRouter from './Candidates/EmployeePutRoutes';
import deleteRouter from './Candidates/EmployeeDeleteRoutes';
import AddEmployeeRoutes from './Employees/Added_Employees_Route';
const router = Router();

router.use(postRouter);
router.use(getRouter);
router.use(putRouter);
router.use(deleteRouter);
router.use(AddEmployeeRoutes);

export default router;
