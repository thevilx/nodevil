import { Types } from 'mongoose';

export interface IPermission {
  _id?: Types.ObjectId;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
