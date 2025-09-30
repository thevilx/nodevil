import { IRolesEnum } from '../../models/role/roles.enum';
import { IUser } from '../../models/user/user';
import { UserCrud } from '../../models/user/user.cruds';
import { RoleService } from '../../services/role.service';

export class TestHelpers {
  static async createTestAdmin(extraUserData: Partial<IUser> = {}): Promise<IUser> {
    const adminRole = await RoleService.getRoleByName(IRolesEnum.ADMIN);

    const defaultData: Partial<IUser> = {
      full_name: 'Admin',
      email: `test${Date.now()}@example.com`,
      password: '123456',
      role: adminRole._id,
      ...extraUserData,
    };

    return await UserCrud.create(defaultData);
  }

  static async createTestCustomer(extraUserData: Partial<IUser> = {}): Promise<IUser> {
    const customerRole = await RoleService.getRoleByName(IRolesEnum.CUSTOMER);

    const defaultData: Partial<IUser> = {
      full_name: `Customer ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: '123456',
      role: customerRole._id,
      ...extraUserData,
    };

    return await UserCrud.create(defaultData);
  }
}
