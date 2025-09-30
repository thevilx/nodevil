import bcrypt from 'bcryptjs';
import { BadRequestError, UnAuthorizedError } from '../../utils/errors';
import { i18n } from '../../config/i18n/i18n';
import { UserCrud } from '../../models/user/user.cruds';
import { IUser } from '../../models/user/user';
import { FilterQuery } from 'mongoose';
import User from '../../models/user/user.schema';

export class AuthService {
  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      const match = await bcrypt.compare(plainPassword, hashedPassword);
      if (match) {
        return match;
      } else {
        throw new BadRequestError(i18n.t('unmatch-password'));
      }
    } catch (err) {
      throw err;
    }
  }

  static async login(uniqueField: string, password: string) {
    try {
      const user = await UserCrud.tryFindOne(
        {
          $or: [{ email: uniqueField }, { phone_number: uniqueField }],
        },
        {
          selectFields: '+password',
        }
      );

      if (user) {
        await AuthService.validatePassword(password, user.password);
        return user;
      } else {
        throw new UnAuthorizedError(i18n.t('unmatch-password'));
      }
    } catch (error: any) {
      throw error;
    }
  }

  static async canSignUp(data: Partial<IUser>) {
    const query: FilterQuery<IUser> = {};
    const orConditions: FilterQuery<IUser>[] = [];

    if (data.email) {
      orConditions.push({ email: data.email });
    }

    if (data.phone_number) {
      orConditions.push({ phone_number: data.phone_number });
    }

    // Only perform the query if at least one field is provided
    if (orConditions.length > 0) {
      query.$or = orConditions;
      await AuthService.throwRegistrationErrorIfUserAlreadyExists(query, data);
    }

    return;
  }
  static async canUpdateProfile(userId: string, data: Partial<IUser>): Promise<void> {
    const orConditions: Array<Partial<IUser>> = [];

    if (data.email) {
      orConditions.push({ email: data.email });
    }

    if (data.phone_number) {
      orConditions.push({ phone_number: data.phone_number });
    }

    // Only perform the query if at least one field is provided
    if (orConditions.length > 0) {
      const query: FilterQuery<IUser> = {
        $and: [
          { _id: { $ne: userId } }, // Exclude current user
          { $or: orConditions }, // Match email or phone
        ],
      };

      await AuthService.throwRegistrationErrorIfUserAlreadyExists(query, data);
    }

    return;
  }

  static async throwRegistrationErrorIfUserAlreadyExists(
    query: FilterQuery<IUser>,
    data: Partial<IUser>
  ) {
    const userAlreadyExist = await User.findOne(query);

    if (userAlreadyExist) {
      if (userAlreadyExist.phone_number === data.phone_number) {
        throw new BadRequestError(i18n.t('phone-number-taken'));
      }

      if (userAlreadyExist.email === data.email) {
        throw new BadRequestError(i18n.t('email-taken'));
      }

      throw new BadRequestError(i18n.t('user-exists-already'));
    }
  }
}
