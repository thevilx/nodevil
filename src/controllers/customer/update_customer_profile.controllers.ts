import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { validateJOI } from '../../utils/general';
import { UserCrud } from '../../models/user/user.cruds';

export class UpdateCustomerProfileController {
  static async updateCurrentCustomerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;

      const joiSchema = Joi.object({
        full_name: Joi.string().optional(),
        avatar: Joi.string().optional(),
      });

      const data = validateJOI(joiSchema, req.body);

      const updatedProfile = await UserCrud.updateById(userId, {
        ...data,
        finishedRegistration: true,
      });

      res.json(updatedProfile);
    } catch (err) {
      next(err);
    }
  }
}
