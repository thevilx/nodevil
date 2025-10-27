import { Router } from 'express';
import authMiddleware from '../../../middlewares/auth.middleware';
import { CustomerAuthController } from '../../../controllers/customer/customer_auth.controllers';
import { GoogleAuthController } from '../../../controllers/auth/google_auth.controllers';
import AppleAuthController from '../../../controllers/auth/apple_auth.controllers';

const router = Router();


router.post('/login', CustomerAuthController.login);
router.post('/register', CustomerAuthController.register);

router.post('/logout', authMiddleware(), CustomerAuthController.logout);

// ---------------------------------------------------
// # enable phone verification routes when needed
// ---------------------------------------------------

// router.post('/send-verification-code', CustomerAuthController.sendVerificationCode);
// router.post('/verify-code', CustomerAuthController.verifyVerificationCode);

// ---------------------------------------------------
// # Enable Google Auth routes when needed
// ---------------------------------------------------

// router.get('/google', GoogleAuthController.getAuthUrl);
// router.get('/google/callback', GoogleAuthController.callbackHandler);

// ---------------------------------------------------
// # Enable Apple Auth routes when needed
// ---------------------------------------------------

// router.get('/apple', AppleAuthController.getAuthUrl);
// router.get('/apple/callback', GoogleAuthController.callbackHandler);

export default router;
