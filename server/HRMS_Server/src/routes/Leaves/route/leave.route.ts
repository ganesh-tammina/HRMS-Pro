import { Router } from 'express';
import {
  createLeaveBalance,
  createLeaveRequest,
  getLeaveBalances,
  getLeaveRequests,
} from '../controller/leave.controller';

const router = Router();

router.post('/leave-balance', createLeaveBalance);
router.get('/leave-balance', getLeaveBalances);

router.post('/leave-request', createLeaveRequest);
router.get('/leave-request', getLeaveRequests);

export default router;
