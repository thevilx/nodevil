import { Request, Response, NextFunction } from 'express';
import { AppConfig } from '../../config/app/app_config';
import appleSignin from 'apple-signin-auth';
import { generateToken } from '../../utils/jwt';
import { UserCrud } from '../../models/user/user.cruds';
import { IRolesEnum } from '../../models/role/roles.enum';
import { getCookieOptions } from '../../utils/general';
import { UserRegisteredWith } from '../../models/user/user.enums';
import { RoleService } from '../../services/role.service';
import { UnExpectedError } from '../../utils/errors';
import { AppleAuthService } from '../../services/auth/apple_auth.service';

export default class AppleAuthController {

  static redirectUri = AppConfig.SERVER_URL + '/customer/auth/apple/callback';

  static async getAuthUrl(req: Request, res: Response, next: NextFunction) {
    try {

      const authorizationUrl = AppleAuthService.generateAuthUrl();

      res.json({ url: authorizationUrl });
    } catch (err) {
      next(err);
    }
  }

  static async callbackHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.body.code;

      const tokenResponse = await AppleAuthService.verifyAppleLoginCode(code);

      const userAppleId = tokenResponse.sub;
      const userEmail = tokenResponse.email;

      const existingUser = await UserCrud.tryFindOne({
        $or: [{ email: userEmail }, { apple_sub: userAppleId }],
      });

      if (existingUser) {
        const token = generateToken(existingUser as any);
        res.cookie('access_token', token, getCookieOptions());
        res.redirect(AppConfig.APP_URL);

        return;
      }

      // Create new user

      const customerRole = await RoleService.getRoleByName(IRolesEnum.CUSTOMER);

      const userData = {
        email: userEmail,
        role: customerRole._id,
        full_name: userEmail.split('@')[0],
        registered_with: UserRegisteredWith.APPLE,
        apple_sub: userAppleId,
        password: Math.random().toString(36).slice(-8),
      };

      const createdUser = await UserCrud.create(userData);
      const token = generateToken(createdUser);

      res.cookie('access_token', token, getCookieOptions());

      res.redirect(AppConfig.APP_URL);

      return;
    } catch (err) {
      next(err);
    }
  }
}
