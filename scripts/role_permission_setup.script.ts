import mongoose from 'mongoose';
import { exit } from 'process';
import { AppConfig } from '../src/config/app/app_config';
import { RoleService } from '../src/services/role.service';

const MONGO_URI = AppConfig.MONGO_URI;

mongoose.connect(MONGO_URI, {}).then(async () => {
  await RoleService.setUpRolePermission();
  exit();
});
