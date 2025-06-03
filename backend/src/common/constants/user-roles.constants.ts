import { UserRole } from '../../modules/users/enums/user-role.enum';

// Roles que tienen permisos de administración
export const ADMIN_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
];

// Roles que pueden gestionar contenido
export const CONTENT_MANAGER_ROLES: UserRole[] = [
  ...ADMIN_ROLES,
  UserRole.MANAGER,
];

// Roles que pueden acceder al panel de administración
export const BACKOFFICE_ROLES: UserRole[] = [
  ...ADMIN_ROLES,
  UserRole.MANAGER,
  UserRole.CUSTOMER_SERVICE,
  UserRole.PRODUCTION,
  UserRole.DESIGNER,
];

// Roles que pueden realizar acciones de administrador
export const SUPER_ADMIN_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
];

// Mapeo de roles a descripciones
// Mapeo de roles a descripciones
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Administrador',
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.MANAGER]: 'Gerente',
  [UserRole.DESIGNER]: 'Diseñador',
  [UserRole.CUSTOMER_SERVICE]: 'Servicio al Cliente',
  [UserRole.PRODUCTION]: 'Producción',
  [UserRole.CUSTOMER]: 'Cliente',
};

// Niveles de permiso para cada rol (mayor número = más permisos)
export const ROLE_PERMISSION_LEVELS: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.ADMIN]: 90,
  [UserRole.MANAGER]: 70,
  [UserRole.DESIGNER]: 50,
  [UserRole.CUSTOMER_SERVICE]: 40,
  [UserRole.PRODUCTION]: 30,
  [UserRole.CUSTOMER]: 10,
};

// Verifica si un rol tiene permisos para realizar una acción
// basado en el nivel de permiso requerido
export function hasPermission(userRole: UserRole, requiredLevel: number): boolean {
  return ROLE_PERMISSION_LEVELS[userRole] >= requiredLevel;
}

// Verifica si un rol está incluido en una lista de roles permitidos
export function isRoleIncluded(role: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(role);
}
