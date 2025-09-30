import { Router } from 'express';
import { ForgotController } from '../controller/forgot-controller';

const router = Router();

router.post('/forgot-pwd', ForgotController.validateEmail);
router.post('/change-pwd', ForgotController.changePawd);

export default router;
