import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { RoleService } from '../services/role.service';
import { PermissionService } from '../services/permission.service';

const roleService = new RoleService();
const permissionService = new PermissionService();

interface RbacOptions {
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL specified roles/permissions
}

export const authorize = (options: RbacOptions) => {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const userId = req.user.id;
    const { roles, permissions, requireAll = false } = options;

    // Check roles
    if (roles && roles.length > 0) {
      const userRoles = await roleService.getUserRoles(userId);
      const userRoleNames = userRoles.map((role) => role.name);

      const hasRole = requireAll
        ? roles.every((role) => userRoleNames.includes(role))
        : roles.some((role) => userRoleNames.includes(role));

      if (!hasRole) {
        throw new AppError('You do not have permission to access this resource', 403);
      }
    }

    // Check permissions
    if (permissions && permissions.length > 0) {
      const userPermissions = await permissionService.getUserPermissions(userId);
      const userPermissionNames = userPermissions.map((permission) => permission.name);

      const hasPermission = requireAll
        ? permissions.every((permission) => userPermissionNames.includes(permission))
        : permissions.some((permission) => userPermissionNames.includes(permission));

      if (!hasPermission) {
        throw new AppError('You do not have permission to access this resource', 403);
      }
    }

    next();
  });
};

// Shorthand middleware for checking single role
export const requireRole = (role: string) => {
  return authorize({ roles: [role] });
};

// Shorthand middleware for checking single permission
export const requirePermission = (permission: string) => {
  return authorize({ permissions: [permission] });
};

// Middleware to check if user has any of the specified roles
export const requireAnyRole = (...roles: string[]) => {
  return authorize({ roles, requireAll: false });
};

// Middleware to check if user has all of the specified roles
export const requireAllRoles = (...roles: string[]) => {
  return authorize({ roles, requireAll: true });
};

// Middleware to check if user has any of the specified permissions
export const requireAnyPermission = (...permissions: string[]) => {
  return authorize({ permissions, requireAll: false });
};

// Middleware to check if user has all of the specified permissions
export const requireAllPermissions = (...permissions: string[]) => {
  return authorize({ permissions, requireAll: true });
};
