import { Router } from 'express';
import miniProfileRoutes from './mini_profile/mini_profile.apis';
import fileUploadRoutes from './file_upload/file_uploader.apis';

const router = Router();

router.use('/mini-profile', miniProfileRoutes);
router.use('/file-upload', fileUploadRoutes);

export default router;
