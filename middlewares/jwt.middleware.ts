import { expressjwt } from 'express-jwt';

import { AppConfig } from '../config/app_config';
import { decodeToken, isTokenExpired } from '../utils/jwt';

const jwtMiddleware = expressjwt({
  secret: AppConfig.JWT_SECRET || 'your-secret-key',
  algorithms: ['HS256'],
  requestProperty: 'access_token',
  credentialsRequired: false, // Allow requests to proceed even if no token is provided
  getToken: function fromHeadersOrCookies(req) {
    let token = null;
    
    // Check for Bearer token in Authorization header
    const authHeader = req?.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    
    // Fall back to cookies (try multiple standard cookie names)
    if (!token) {
      token = req.cookies?.token || req.cookies?.auth_token || req.cookies?.access_token;
    }
    
    if (token) {
      if (!isTokenExpired(token)) {
        const decodedToken = decodeToken(token);
        req.userId = decodedToken.id;
        return token;
      }
    }
    return null;
  },
}).unless({
  // This will ensure the middleware runs for all routes
  path: [], // Add paths here if you want to exclude specific routes
});

export default jwtMiddleware;
