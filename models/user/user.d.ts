import { Types } from 'mongoose';
import { IRole } from '../role/role';
import { UserRegisteredWith } from './user.enums';

export interface IUser {
  _id?: Types.ObjectId;
  phone_number: string;
  email: string;
  password: string;
  role: Types.ObjectId | IRole;
  active: boolean;
  full_name: string;
  avatar: string | null;
  finishedRegistration: boolean;
  user_registered_with: UserRegisteredWith;
  createdAt?: Date;
  updatedAt?: Date;
}
