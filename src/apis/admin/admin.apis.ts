import { Router } from 'express';
import adminAuthRoutes from './auth/admin_auth.apis';

const router = Router();

router.use('/auth', adminAuthRoutes);

export default router;
