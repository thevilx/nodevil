import { Router } from 'express';
import { AdminAuthController } from '../../../controllers/admin/admin_auth.controllers';

const router = Router();

router.post('/login', AdminAuthController.login);
router.post('/logout', AdminAuthController.logout);

export default router;
