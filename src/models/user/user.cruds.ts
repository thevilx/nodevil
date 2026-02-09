import { IUser } from './user';
import User from './user.schema';
import { Crud } from '../crud';

class UserCrudClass extends Crud<IUser> {
  constructor() {
    super(User, 'user-not-found');
  }
}

export const UserCrud = new UserCrudClass();
