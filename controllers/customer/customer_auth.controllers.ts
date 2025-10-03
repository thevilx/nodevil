import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AppConfig } from '../../config/app/app_config';
import { i18n } from '../../config/i18n/i18n';
import { VerificationService } from '../../services/auth/verify_phone.service';
import { getCookieOptions, validateJOI } from '../../utils/general';
import { generateToken } from '../../utils/jwt';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';

export class CustomerAuthController {

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const joiSchema = Joi.object({
        uniqueField: Joi.string().required(),
        password: Joi.string().required(),
      });

      const data = validateJOI(joiSchema, req.body);

      const user = await AuthService.login(data.uniqueField, data.password);

      const token = generateToken(user as any);
      res.cookie('access_token', token, getCookieOptions());

      res.json({
        access_token: token,
        message: i18n.t('login-successful'),
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const joiSchema = Joi.object({
        full_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      });

      const data = validateJOI(joiSchema, req.body);

      await AuthService.canSignUp(data);

      const user = await UserService.registerCustomer(data);

      const token = generateToken(user as any);

      res.cookie('access_token', token, getCookieOptions());

      res.json({
        message: i18n.t('register-successful'),
        access_token: token,
      });
    } catch (error) {
      next(error);
    }
  }


  static async sendVerificationCode(req: Request, res: Response, next: NextFunction) {
    try {
      const joiSchema = Joi.object({
        phone_number: Joi.string().required(),
      });

      const data = validateJOI(joiSchema, req.body);

      const code = await VerificationService.sendVerificationCode(data.phone_number);

      res.json({
        message: i18n.t('verification-code-has-been-sent'),
        code: AppConfig.NODE_ENV === 'production' ? undefined : code,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyVerificationCode(req: Request, res: Response, next: NextFunction) {
    try {
      const joiSchema = Joi.object({
        code: Joi.string().required(),
        phone_number: Joi.string().required(),
      });

      const data = validateJOI(joiSchema, req.body);

      const { user, should_update_profile } = await VerificationService.verifyCode(
        data.phone_number,
        data.code
      );

      const token = generateToken(user as any);

      res.cookie('access_token', token, getCookieOptions());

      res.json({
        message: i18n.t('register-successful'),
        should_update_profile,
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
