// src/routes/candidates/index.ts
import { Router } from 'express';
import postRouter from './candidates/employeePostRoutes';
import getRouter from './candidates/EmployeeGetRoutes';
import putRouter from './candidates/EmployeePutRoutes';
import deleteRouter from './candidates/EmployeeDeleteRoutes';
import AddEmployeeRoutes from './Employees/Added_Employees_Route';
const router = Router();

router.use(postRouter);
router.use(getRouter);
router.use(putRouter);
router.use(deleteRouter);
router.use(AddEmployeeRoutes);

export default router;
