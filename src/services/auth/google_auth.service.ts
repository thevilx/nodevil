import { OAuth2Client } from 'google-auth-library';
import { AppConfig } from '../../config/app/app_config';
import { UnExpectedError } from '../../utils/errors';

// Static class
export class GoogleAuthService {

  private static readonly redirectUri = AppConfig.SERVER_URL + '/customer/auth/google/callback';

  private static readonly client = new OAuth2Client(
    AppConfig.GOOGLE_CLIENT_ID,
    AppConfig.GOOGLE_CLIENT_SECRET,
    this.redirectUri
  );

  /**
   * Verifies a Google ID token.
   * @param idToken The ID token received from Google.
   * @returns The payload of the verified token.
   */
  public static async verifyIdToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: AppConfig.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  }

  /**
   * Generates the Google authentication URL.
   * @returns The authorization URL.
   */
  public static generateAuthUrl() {

    if (!AppConfig.GOOGLE_CLIENT_ID) {
      throw new UnExpectedError('Google Client ID is not configured');
    }

    if (!AppConfig.GOOGLE_CLIENT_SECRET) {
      throw new UnExpectedError('Google Client Secret is not configured');
    }

    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    });
  }

  /**
   * Gets the Google access token using the provided authorization code.
   * @param code Authorization code received from Google.
   * @returns Token response containing access token.
   */
  public static async getToken(code: string) {
    return await this.client.getToken(code);
  }
}
