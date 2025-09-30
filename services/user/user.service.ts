import { i18n } from '../../config/i18n/i18n';
import { IUser } from '../../models/user/user';
import { UserCrud } from '../../models/user/user.cruds';
import { BadRequestError } from '../../utils/errors';
import { AuthService } from '../auth/auth.service';

export class UserService {
  static async loginWithPhoneNumberOrEmail(uniqueField: string, password: string) {
    const user = await UserCrud.findOne(
      {
        $or: [{ phone_number: uniqueField }, { email: uniqueField }],
      },
      {
        selectFields: '+password',
      }
    );

    if (!user) {
      throw new BadRequestError(i18n.t('unmatch-password'));
    }

    // if the user is disabled
    if (!user.active) {
      throw new BadRequestError(i18n.t('your-account-is-disabled'));
    }

    await AuthService.validatePassword(password, user.password);

    return user;
  }

  static async register(data: Partial<IUser>) {
    const user = await UserCrud.create(data);

    return user;
  }
}
