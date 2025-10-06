import { Router } from 'express';
import AttendanceController from './attendance-controller';

const router = Router();

router.post('/clockin', AttendanceController.handleClockIn);
router.post('/clockout', AttendanceController.handleClockOut);
router.get('/notinyet', AttendanceController.notinyet);

export default router;
