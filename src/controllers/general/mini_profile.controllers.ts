import { NextFunction, Request, Response } from 'express';
import { UserCrud } from '../../models/user/user.cruds';
import { NotFoundError } from '../../utils/errors';
import { i18n } from '../../config/i18n/i18n';

export class MiniProfileController {
  static async fetchCurrentUserMiniProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;

      const user = await UserCrud.findById(userId.toString());

      if (!user || !user._id) {
        throw new NotFoundError(i18n.t('user-not-found'));
      }

      const miniProfile = {
        _id: user._id.toString(),
        full_name: user.full_name,
        avatar: user.avatar,
      };

      res.json(miniProfile);
    } catch (err) {
      next(err);
    }
  }
}
