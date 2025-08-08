/**
 * This file contains middleware for permission checks, 
 * ensuring that mechanic admins have the required permissions 
 * based on their roles.
 * 
 * Author: Ahmed Aredah
 */

import { PermissionEnum, RolePermissions } from '../enums/permissions.enum.js';

// Check if mechanic admin has specific permission
const hasPermission = (permission) => {
    if (!Object.values(PermissionEnum).includes(permission)) {
        throw new Error(`Invalid permission: ${permission}`);
    }

    return async (req, res, next) => {
        try {
            if (!req.mechanicAdminRole) {
                return res.status(403).json({ message: 'Role not found' });
            }

            const allowedPermissions = RolePermissions[req.mechanicAdminRole];
            
            if (!allowedPermissions.includes(permission)) {
                return res.status(403).json({ 
                    message: `Permission '${permission}' required`
                });
            }
            
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Error checking permissions' });
        }
    };
};

export { hasPermission };