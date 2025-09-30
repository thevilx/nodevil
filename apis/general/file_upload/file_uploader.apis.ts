import express from 'express';
import multer from 'multer';
import { FileUploaderController } from '../../../controllers/general/uploader.controllers';

const router = express.Router();

router.post(
  '/image-uploader',
  multer({
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }).single('file'),
  FileUploaderController.uploadImage
);

export default router;
