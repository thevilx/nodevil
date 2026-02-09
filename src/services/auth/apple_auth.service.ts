import { AppConfig } from "../../config/app/app_config";
import appleSignin from 'apple-signin-auth';
import { UnExpectedError } from "../../utils/errors";


export class AppleAuthService {

    private static readonly redirectUri = AppConfig.SERVER_URL + '/customer/auth/apple/callback';


    static generateAuthUrl() {

        if (!AppConfig.APPLE_CLIENT_ID) {
            throw new Error('Apple Client ID is not configured');
        }

        return appleSignin.getAuthorizationUrl({
            clientID: AppConfig.APPLE_CLIENT_ID,
            redirectUri: this.redirectUri,
            responseMode: 'form_post',
            scope: 'email',
        });
    }

    static async verifyAppleLoginCode(code: string) {

        try {

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
                redirectUri: this.redirectUri,
                clientSecret: clientSecret,
            };

            const tokenResponse = await appleSignin.getAuthorizationToken(code, options);

            const jwtClaims = await appleSignin.verifyIdToken(tokenResponse.id_token, {
                audience: AppConfig.APPLE_CLIENT_ID,
                ignoreExpiration: false,
            });

            return jwtClaims;

        } catch (err) {
            throw err;
        }
    }

}