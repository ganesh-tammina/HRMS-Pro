// src/routes/candidates/index.ts
import { Router } from 'express';
import postRouter from './candidates/employeePostRoutes';
import getRouter from './candidates/EmployeeGetRoutes';
import putRouter from './candidates/EmployeePutRoutes';
import deleteRouter from './candidates/EmployeeDeleteRoutes';
import attendancePostRouter from './candidates/attendance/attandancePostRoutes';
import attendanceGetRouter from './candidates/attendance/attandanceGetRoutes';
// import employeeRouter from './Employees/employeeRoutes';
import AddEmployeeRoutes from './Employees/Added_Employees_Route';
const router = Router();

router.use(postRouter);
router.use(getRouter);
router.use(putRouter);
router.use(deleteRouter);
router.use(attendancePostRouter); // ✅ now mounted under /candidates
router.use(attendanceGetRouter);
router.use(AddEmployeeRoutes);

export default router;
