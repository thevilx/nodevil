import mongoose from 'mongoose';
import { exit } from 'process';
import { AppConfig } from '../config/app_config';
import { RoleService } from '../services/role.service';

const MONGO_URI = AppConfig.MONGO_URI;

mongoose.connect(MONGO_URI, {}).then(async () => {
  await RoleService.setUpRolePermission();
  exit();
});
