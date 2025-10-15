import { Router } from 'express';
import { ForgotController } from '../controller/forgot-controller';

const router = Router();

router.post('/forgot-pwd', ForgotController.validateEmail);
router.post('/change-pwd', ForgotController.changePawd);


// new emp
router.post('/add-pwd', ForgotController.thisIsSignUp);
router.post('/change-new-pwd', ForgotController.asatph);

export default router;
