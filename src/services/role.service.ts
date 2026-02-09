import { i18n } from '../config/i18n/i18n';
import { INITIAL_ROLES, ALL_PERMISSIONS } from '../config/role_permissions.config';
import { IPermission } from '../models/permission/permission';
import Permission from '../models/permission/permission.schema';
import { IRole } from '../models/role/role';
import Role from '../models/role/role.schema';
import { IRolesEnum } from '../models/role/roles.enum';
import { UserCrud } from '../models/user/user.cruds';
import { BadRequestError, UnExpectedError } from '../utils/errors';
import { PermissionService } from './permission.service';

export class RoleService {
  static async checkUserRoleIsAdmin(userId: string) {
    const user = await UserCrud.findById(userId, {
      populate: {
        path: 'role',
      },
    });

    if ((user.role as IRole).name !== IRolesEnum.ADMIN) {
      throw new BadRequestError(i18n.t('cant-login-with-this-role'));
    }
  }

  static async checkUserRoleIsCustomer(userId: string) {
    const user = await UserCrud.findById(userId, {
      populate: {
        path: 'role',
      },
    });

    if ((user.role as IRole).name !== IRolesEnum.CUSTOMER) {
      throw new BadRequestError(i18n.t('cant-login-with-this-role'));
    }
  }

  static async createManyRoles(roles: IRole[]): Promise<void> {
    try {
      await Promise.all(
        roles.map(async role => {
          const filter = { name: role.name };
          const update = { $set: role };
          const options = { upsert: true };
          return Role.updateOne(filter, update, options);
        })
      );
    } catch (err) {
      console.log('Could not create many roles due to err in cruds: ', err);
      throw err;
    }
  }

  // get a role object with id as input and return a Promise
  static async getRole(id: string): Promise<IRole | null> {
    try {
      const result = await Role.findById(id).populate('permissions');
      return result;
    } catch (error) {
      console.log('Error in getting role: ', error);
      throw error;
    }
  }

  static async getRoleByName(name: string): Promise<IRole> {
    try {
      const role = await Role.findOne({ name: name });
      if (!role) {
        throw new UnExpectedError(i18n.t('role_not_found'));
      }
      return role;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Setups roles
   */
  static async setupRoles() {
    try {
      const newRoles: Partial<IRole>[] = [];
      for (const role of INITIAL_ROLES) {
        const newRole: Partial<IRole> = {
          name: role.name,
          permissions: [],
        };

        const newPermissions: IPermission[] = [];

        const permissionsMap = (await Permission.find({})).reduce((acc: any, permission) => {
          acc[permission.name] = permission._id;
          return acc;
        }, {});

        for (const permissionName of role.permissions) {
          const permission: any = permissionsMap[permissionName];
          if (permission) {
            newPermissions.push(permission);
          }
        }

        newRole.permissions = newPermissions;
        newRoles.push(newRole);
      }

      await RoleService.createManyRoles(newRoles as IRole[]);
    } catch (err) {
      console.log('Could not setup roles due to err: ', err);
      throw err;
    }
  }

  /**
   * Creates all permissions
   * @returns
   */
  static async setUpRolePermissionObject() {
    try {
      const permission_list = ALL_PERMISSIONS.map(permission_name => {
        return {
          name: permission_name,
        };
      });

      await PermissionService.createManyPermissions(permission_list);
    } catch (err) {
      console.log('issue in creating permissions ', err);
      throw err;
    }
  }

  /**
   * setup permission & roles
   * @returns
   */
  static async setUpRolePermission() {
    try {
      await RoleService.setUpRolePermissionObject();
      await RoleService.setupRoles();
      console.log('Role/Permission Updated');
      return true;
    } catch (error) {
      console.log('issue in creating permissions ', error);
      throw error; // Ensure the error is re-thrown
    }
  }
}
