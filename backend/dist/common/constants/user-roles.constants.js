"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSION_LEVELS = exports.ROLE_DESCRIPTIONS = exports.SUPER_ADMIN_ROLES = exports.BACKOFFICE_ROLES = exports.CONTENT_MANAGER_ROLES = exports.ADMIN_ROLES = void 0;
exports.hasPermission = hasPermission;
exports.isRoleIncluded = isRoleIncluded;
const user_role_enum_1 = require("../../modules/users/enums/user-role.enum");
exports.ADMIN_ROLES = [
    user_role_enum_1.UserRole.SUPER_ADMIN,
    user_role_enum_1.UserRole.ADMIN,
];
exports.CONTENT_MANAGER_ROLES = [
    ...exports.ADMIN_ROLES,
    user_role_enum_1.UserRole.MANAGER,
];
exports.BACKOFFICE_ROLES = [
    ...exports.ADMIN_ROLES,
    user_role_enum_1.UserRole.MANAGER,
    user_role_enum_1.UserRole.CUSTOMER_SERVICE,
    user_role_enum_1.UserRole.PRODUCTION,
    user_role_enum_1.UserRole.DESIGNER,
];
exports.SUPER_ADMIN_ROLES = [
    user_role_enum_1.UserRole.SUPER_ADMIN,
];
exports.ROLE_DESCRIPTIONS = {
    [user_role_enum_1.UserRole.SUPER_ADMIN]: 'Super Administrador',
    [user_role_enum_1.UserRole.ADMIN]: 'Administrador',
    [user_role_enum_1.UserRole.MANAGER]: 'Gerente',
    [user_role_enum_1.UserRole.DESIGNER]: 'Diseñador',
    [user_role_enum_1.UserRole.CUSTOMER_SERVICE]: 'Servicio al Cliente',
    [user_role_enum_1.UserRole.PRODUCTION]: 'Producción',
    [user_role_enum_1.UserRole.CUSTOMER]: 'Cliente',
};
exports.ROLE_PERMISSION_LEVELS = {
    [user_role_enum_1.UserRole.SUPER_ADMIN]: 100,
    [user_role_enum_1.UserRole.ADMIN]: 90,
    [user_role_enum_1.UserRole.MANAGER]: 70,
    [user_role_enum_1.UserRole.DESIGNER]: 50,
    [user_role_enum_1.UserRole.CUSTOMER_SERVICE]: 40,
    [user_role_enum_1.UserRole.PRODUCTION]: 30,
    [user_role_enum_1.UserRole.CUSTOMER]: 10,
};
function hasPermission(userRole, requiredLevel) {
    return exports.ROLE_PERMISSION_LEVELS[userRole] >= requiredLevel;
}
function isRoleIncluded(role, allowedRoles) {
    return allowedRoles.includes(role);
}
//# sourceMappingURL=user-roles.constants.js.map