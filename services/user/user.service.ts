import { i18n } from '../../config/i18n/i18n';
import { IRolesEnum } from '../../models/role/roles.enum';
import { IUser } from '../../models/user/user';
import { UserCrud } from '../../models/user/user.cruds';
import { BadRequestError } from '../../utils/errors';
import { AuthService } from '../auth/auth.service';
import { RoleService } from '../role.service';

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

  static async registerCustomer(data: Partial<IUser>) {
    data.role = (await RoleService.getRoleByName(IRolesEnum.CUSTOMER))._id;
    const user = await UserCrud.create(data);

    return user;
  }
}
