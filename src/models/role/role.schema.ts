import mongoose, { Schema } from 'mongoose';
import { IRole } from './role';
import { IRolesEnum } from './roles.enum';

const RoleSchema: Schema = new Schema<IRole>(
  {
    name: { type: String, enum: Object.values(IRolesEnum), required: true },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);

const Role = mongoose.model<IRole>('Role', RoleSchema);

export default Role;
