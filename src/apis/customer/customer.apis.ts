import { Router } from 'express';

import authMiddleware from '../../middlewares/auth.middleware';
import customerAuthRoutes from './auth/customer_auth.apis';
import { UpdateCustomerProfileController } from '../../controllers/customer/update_customer_profile.controllers';

const router = Router();

router.use('/auth', customerAuthRoutes);

router.post(
  '/update-profile',
  authMiddleware(),
  UpdateCustomerProfileController.updateCurrentCustomerProfile
);

export default router;
