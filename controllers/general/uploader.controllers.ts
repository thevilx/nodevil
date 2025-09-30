import { NextFunction, Request, Response } from 'express';
import { i18n } from '../../config/i18n/i18n';
import { StorageManager } from '../../services/storage/storage-manager';
import { BadRequestError } from '../../utils/errors';

export class FileUploaderController {
  static async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;

      if (!file) {
        throw new BadRequestError(i18n.t('no-file-received'));
      }

      const storageManager = StorageManager.getInstance();

      storageManager.assertFileIsImage(file.mimetype);

      const result = await storageManager
        .getDriver()
        .upload('image', file.originalname, file.mimetype, file.buffer);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
