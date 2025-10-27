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

export default class AppleAuthController {
  static async getAuthUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationUrl = appleSignin.getAuthorizationUrl({
        clientID: AppConfig.APPLE_CLIENT_ID || "",
        redirectUri: AppConfig.SERVER_URL + '/auth/apple/callback',
        responseMode: 'form_post',
        scope: 'email',
      });

      res.json({ url: authorizationUrl });
    } catch (err) {
      next(err);
    }
  }

  static async callbackHandler(req: Request, res: Response, next: NextFunction) {
    const code = req.body.code;


    if (!AppConfig.APPLE_CLIENT_ID || !AppConfig.APPLE_TEAM_ID || !AppConfig.APPLE_KEY_ID || !AppConfig.APPLE_PRIVATE_KEY) {
      throw new UnExpectedError('Apple SignIn not configured properly');
    }

    const clientSecret = appleSignin.getClientSecret({
      clientID: AppConfig.APPLE_CLIENT_ID,
      teamID: AppConfig.APPLE_TEAM_ID,
      privateKey: AppConfig.APPLE_PRIVATE_KEY,
      keyIdentifier: AppConfig.APPLE_KEY_ID,
    });

    const options = {
      clientID: AppConfig.APPLE_CLIENT_ID,
      redirectUri: AppConfig.SERVER_URL + '/auth/apple/callback',
      clientSecret: clientSecret,
    };

    try {
      const tokenResponse = await appleSignin.getAuthorizationToken(code, options);

      const jwtClaims = await appleSignin.verifyIdToken(tokenResponse.id_token, {
        audience: AppConfig.APPLE_CLIENT_ID,
        ignoreExpiration: false,
      });

      const userAppleId = jwtClaims.sub;
      const userEmail = jwtClaims.email;

      const existingUser = await UserCrud.findOne({
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
