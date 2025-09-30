import mongoose, { Schema } from 'mongoose';
import { IUser } from './user';
import { UserRegisteredWith } from './user.enums';
import bcrypt from 'bcryptjs';

const UserSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // This ensures uniqueness only for non-null values
      index: true,
    },
    phone_number: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // This ensures uniqueness only for non-null values
      index: true,
    },
    password: {
      type: String,
      default: '',
    },
    full_name: { type: String, required: true },
    avatar: { type: String, required: false, default: null },
    user_registered_with: { type: String, enum: Object.values(UserRegisteredWith) },

    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    active: { type: Boolean, default: true },
    finishedRegistration: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: true,
  }
);

UserSchema.pre('save', async function (next) {
  const user = this as any;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as any;

  // Check if password is being updated
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }

  next();
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
