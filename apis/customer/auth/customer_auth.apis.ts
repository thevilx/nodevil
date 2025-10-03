import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware';
import { CustomerAuthController } from '../../../controllers/customer/customer_auth.controllers';

const router = Router();


router.post('/login', CustomerAuthController.login);
router.post('/register', CustomerAuthController.register);

// router.post('/send-verification-code', CustomerAuthController.sendVerificationCode);
// router.post('/verify-code', CustomerAuthController.verifyVerificationCode);

router.post('/logout', authMiddleware(), CustomerAuthController.logout);

export default router;
