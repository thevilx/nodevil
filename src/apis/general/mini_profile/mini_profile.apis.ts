import { Router } from 'express';
import { PANEL_PERMISSIONS } from '../../../config/role_permissions.config';
import authMiddleware from '../../../middlewares/auth.middleware';
import { MiniProfileController } from '../../../controllers/general/mini_profile.controllers';

const router = Router();

router.get(
  '/admin',
  authMiddleware([PANEL_PERMISSIONS.ADMIN]),
  MiniProfileController.fetchCurrentUserMiniProfile
);

router.get(
  '/customer',
  authMiddleware([PANEL_PERMISSIONS.CUSTOMER]),
  MiniProfileController.fetchCurrentUserMiniProfile
);

export default router;
