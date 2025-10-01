import mongoose from 'mongoose';
import { exit } from 'process';
import { AppConfig } from '../config/app/app_config';
import { IRolesEnum } from '../models/role/roles.enum';
import { UserCrud } from '../models/user/user.cruds';
import { RoleService } from '../services/role.service';

async function createAdminUser() {
  try {
    const adminRole = await RoleService.getRoleByName(IRolesEnum.ADMIN);

    if (!adminRole) {
      throw new Error('Could not find admin role');
    }

    const email = 'admin@gmail.com';
    const phone_number = '9195471811';

    const userData: any = {
      phone_number: phone_number,
      active: true,
      email: email,
      token: '',
      role: adminRole,
      mini_profile: {
        full_name: 'Admin',
        avatar: '',
      },
      password: '123456',
    };

    // create a user
    await UserCrud.create(userData);
  } catch (error) {
    console.error('Error creating admin user', error);
  }
}

const MONGO_URI = AppConfig.MONGO_URI;

mongoose.connect(MONGO_URI, {}).then(async () => {
  await createAdminUser();
  exit();
});
