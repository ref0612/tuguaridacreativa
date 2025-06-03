import { UserRole } from '../../modules/users/enums/user-role.enum';
export declare const ADMIN_ROLES: UserRole[];
export declare const CONTENT_MANAGER_ROLES: UserRole[];
export declare const BACKOFFICE_ROLES: UserRole[];
export declare const SUPER_ADMIN_ROLES: UserRole[];
export declare const ROLE_DESCRIPTIONS: Record<UserRole, string>;
export declare const ROLE_PERMISSION_LEVELS: Record<UserRole, number>;
export declare function hasPermission(userRole: UserRole, requiredLevel: number): boolean;
export declare function isRoleIncluded(role: UserRole, allowedRoles: UserRole[]): boolean;
