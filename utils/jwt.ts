import jwt from 'jsonwebtoken';
import { IUser } from '../models/user/user';
import { AppConfig } from '../config/app_config';

const secretKey = AppConfig.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
  id: string;
}

/**
 * Generates token
 *
 * @param {any} user - user data
 * @returns
 */
export function generateToken(user: IUser) {
  const payload = {
    id: user?._id,
  };

  return jwt.sign(payload, secretKey, { expiresIn: '60d' });
}

/**
 * Verify token
 *
 * @param {string} token
 * @returns
 */
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secretKey) as DecodedToken;
  } catch {
    return null;
  }
}

/**
 * Determines whether token expired is
 *
 * @param {string} tokenCode
 * @returns true if token expired
 */
export function isTokenExpired(tokenCode: string): boolean {
  try {
    const decodedToken = jwt.verify(tokenCode, secretKey) as { exp: number };
    const expirationTime = decodedToken.exp * 1000; // convert expiration time to milliseconds
    const currentTime = Date.now();
    return currentTime > expirationTime; // return true if current time is after expiration time
  } catch (err) {
    console.log('Could not verify token due to error: ', err);
    return true; // return true if token verification fails
  }
}

/**
 * Decodes token
 *
 * @param {string} tokenCode
 * @returns {DecodedToken} decoded token
 */
export function decodeToken(tokenCode: string): DecodedToken {
  try {
    return jwt.verify(tokenCode, secretKey) as DecodedToken;
  } catch (err) {
    console.log('Could not decode token due to error: ', err);
    throw new Error('Wrong formatted token has been provided');
  }
}
