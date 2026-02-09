import { Types } from 'mongoose';
import { IPermission } from '../permission/permission';
import { IRolesEnum } from './roles.enum';

export interface IRole {
  _id?: Types.ObjectId;
  name: IRolesEnum;
  permissions: Types.ObjectId[] | IPermission[];
  createdAt?: Date;
  updatedAt?: Date;
}
