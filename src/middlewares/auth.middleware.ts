import { NextFunction, Request, Response } from 'express';
import { i18n } from '../config/i18n/i18n';
import { IRole } from '../models/role/role';
import { UserCrud } from '../models/user/user.cruds';
import { ForbiddenError, UnAuthorizedError } from '../utils/errors';
import { decodeToken, isTokenExpired } from '../utils/jwt';

const authMiddleware =
  (permissions?: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract token from Authorization header (Bearer token) or cookies
      let token = null;
      
      // Check for Bearer token in Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
      
      // Fall back to cookies (try multiple standard cookie names)
      if (!token) {
        token = req.cookies?.token || req.cookies?.auth_token || req.cookies?.access_token;
      }
      if (!token) {
        throw new UnAuthorizedError(i18n.t('errors.unauthorized-access'));
      }

      // Check if the token is expired
      if (isTokenExpired(token)) {
        throw new UnAuthorizedError(i18n.t('errors.unauthorized-access'));
      }

      // Decode token and attach userId to the request
      const decodedToken = decodeToken(token);
      req.userId = decodedToken.id;

      // Fetch user by ID and check permissions
      const user = await UserCrud.tryFindById(decodedToken.id, {
        populate: {
          path: 'role',
          populate: {
            path: 'permissions',
          },
        },
      });

      if (!user) {
        throw new ForbiddenError(i18n.t('errors.unauthorized-access'));
      }

      if (permissions) {
        const permissions_list = ((user?.role as IRole)?.permissions || []).map(
          (item: any) => item.name
        );

        const hasAllPermissions = permissions.every(permission =>
          permissions_list.includes(permission)
        );

        if (!hasAllPermissions) {
          throw new ForbiddenError(i18n.t('errors.unauthorized-access'));
        }
      }

      next();
    } catch (error) {
      console.error('Auth Middleware Error: ', error);
      next(error);
    }
  };

export default authMiddleware;
