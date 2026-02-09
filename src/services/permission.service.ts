import { IPermission } from '../models/permission/permission';
import Permission from '../models/permission/permission.schema';

export class PermissionService {
  static async createManyPermissions(permissions: IPermission[]): Promise<void> {
    try {
      if (!permissions.length) {
        return;
      }
      const bulkOps = permissions.map(permission => ({
        updateOne: {
          filter: { name: permission.name },
          update: { $set: permission },
          upsert: true,
        },
      }));
      await Permission.bulkWrite(bulkOps, { ordered: false });
    } catch (err) {
      console.log('Could not create many permissions due to error in utils: ', err);
      throw err;
    }
  }
}
