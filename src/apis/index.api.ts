import { Router } from 'express';
import generalRoutes from './general/general.apis';
import customerRoutes from './customer/customer.apis';
import adminRoutes from './admin/admin.apis';
import healthRoutes from './health/health.apis';

const router = Router();

router.use('/', healthRoutes);
router.use('/general', generalRoutes);
router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);

export default router;
