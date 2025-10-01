import { IRolesEnum } from '../models/role/roles.enum';
import { USER_PERMISSIONS } from '../models/user/user.permissions';

// -------------------------------------------------------------------------------------------------
// Panel Permissions
// -------------------------------------------------------------------------------------------------

export enum PANEL_PERMISSIONS {
  CUSTOMER = 'CUSTOMER_PANEL',
  ADMIN = 'ADMIN_PANEL',
}

// -------------------------------------------------------------------------------------------------
// Permissions by Role
// -------------------------------------------------------------------------------------------------

const CUSTOMER_PERMISSIONS: string[] = [
  PANEL_PERMISSIONS.CUSTOMER
];

const ADMIN_PERMISSIONS: string[] = [
  PANEL_PERMISSIONS.ADMIN,
  ...(Object.values(USER_PERMISSIONS))
];

export const ALL_PERMISSIONS: string[] = [
  ...CUSTOMER_PERMISSIONS,
  ...ADMIN_PERMISSIONS
];

// -------------------------------------------------------------------------------------------------
// Initial Roles
// -------------------------------------------------------------------------------------------------

const CustomerRole = {
  name: IRolesEnum.CUSTOMER,
  permissions: CUSTOMER_PERMISSIONS,
};

const AdminRole = {
  name: IRolesEnum.ADMIN,
  permissions: ADMIN_PERMISSIONS,
};

export const INITIAL_ROLES = [CustomerRole, AdminRole];
