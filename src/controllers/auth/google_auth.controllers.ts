import { NextFunction, Request, Response } from 'express';
import { AppConfig } from '../../config/app/app_config';
import { IRolesEnum } from '../../models/role/roles.enum';
import { UserCrud } from '../../models/user/user.cruds';
import { UserRegisteredWith } from '../../models/user/user.enums';
import { GoogleAuthService } from '../../services/auth/google_auth.service';
import { RoleService } from '../../services/role.service';
import { UnExpectedError } from '../../utils/errors';
import { getCookieOptions } from '../../utils/general';
import { generateToken } from '../../utils/jwt';

export interface GoogleAuthRequest {
  idToken: string;
}

export interface GoogleAuthResponse {
  access_token: string;
  newUser: boolean;
}

export class GoogleAuthController {

  static async getAuthUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const authUrl = GoogleAuthService.generateAuthUrl();

      res.json({ redirectUrl: authUrl });
    } catch (error) {
      next(error);
    }
  }

  static async callbackHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.query.code;

      const { tokens } = await GoogleAuthService.getToken(code as string);

      // Verify Google ID token
      const payload = await GoogleAuthService.verifyIdToken(tokens.id_token || '');

      if (!payload) {
        throw new UnExpectedError('Invalid ID token');
      }

      const { sub, email, name } = payload;

      if (!email) {
        throw new UnExpectedError('Error fetching data from Google');
      }

      // Check if user already exists
      const user = await UserCrud.tryFindOne({
        $or: [{ email: email }, { google_token_id: sub }],
      });

      if (user) {
        // User exists, generate JWT
        const token = generateToken(user as any);

        res.cookie('access_token', token, getCookieOptions());

        res.redirect(AppConfig.APP_URL);

        return;
      }

      const customerRole = await RoleService.getRoleByName(IRolesEnum.CUSTOMER);
      // User doesn't exist, create a new one
      const userData = {
        email: email,
        phone: null,
        role: customerRole._id,
        full_name: name?.trim() || '',
        google_token_id: sub,
        registered_with: UserRegisteredWith.GOOGLE,
        password: Math.random().toString(36).slice(-8), // Random password
      };

      const createdUser = await UserCrud.create(userData);
      const token = generateToken(createdUser);

      res.cookie('access_token', token, getCookieOptions());

      res.redirect(AppConfig.APP_URL);
      return;
    } catch (error) {
      next(error);
    }
  }
}
