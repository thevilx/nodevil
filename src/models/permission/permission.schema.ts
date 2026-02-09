import mongoose from 'mongoose';
import { IPermission } from './permission';
const Schema = mongoose.Schema;

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const Permission = mongoose.model<IPermission>('Permission', permissionSchema);

export default Permission;
