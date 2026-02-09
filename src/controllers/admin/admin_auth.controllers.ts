import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { getCookieOptions, validateJOI } from '../../utils/general';
import { UserService } from '../../services/user/user.service';
import { generateToken } from '../../utils/jwt';
import { i18n } from '../../config/i18n/i18n';
import { RoleService } from '../../services/role.service';

export class AdminAuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginSchema = Joi.object({
        uniqueField: Joi.string().required(),
        password: Joi.string().required(),
      });

      const data = validateJOI(loginSchema, req.body);

      const user = await UserService.loginWithPhoneNumberOrEmail(data.uniqueField, data.password);

      // check if the user role is Admin
      await RoleService.checkUserRoleIsAdmin(user!._id!.toString());

      const token = generateToken(user);

      res.cookie('access_token', token, getCookieOptions());

      res.json({
        message: i18n.t('login-successful'),
        access_token: token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('access_token');

      res.json({
        message: i18n.t('logout-successfully'),
      });
    } catch (error) {
      next(error);
    }
  }
}
