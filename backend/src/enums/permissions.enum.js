/**
 * This file defines the permissions, roles, and their associated permissions 
 * used for access control within the system.
 * 
 * Author: Ahmed Aredah
 */

export const PermissionEnum = {
    MANAGE_ADMINS: 'manageAdmins',
    MANAGE_SERVICES: 'manageServices',
    MANAGE_SCHEDULE: 'manageSchedule',
    MANAGE_APPOINTMENTS: 'manageAppointments',
    VIEW_FINANCES: 'viewFinances',
    VIEW_ANALYTICS: 'viewAnalytics',
};

export const RoleEnum = {
    OWNER: 'owner',
    MANAGER: 'manager',
    STAFF: 'staff',
};

export const RolePermissions = {
    [RoleEnum.OWNER]: [
        PermissionEnum.MANAGE_ADMINS,
        PermissionEnum.MANAGE_SERVICES,
        PermissionEnum.MANAGE_SCHEDULE,
        PermissionEnum.MANAGE_APPOINTMENTS,
        PermissionEnum.VIEW_FINANCES,
        PermissionEnum.VIEW_ANALYTICS
    ],
    [RoleEnum.MANAGER]: [
        PermissionEnum.MANAGE_SERVICES,
        PermissionEnum.MANAGE_SCHEDULE,
        PermissionEnum.MANAGE_APPOINTMENTS,
        PermissionEnum.VIEW_FINANCES,
        PermissionEnum.VIEW_ANALYTICS
    ],
    [RoleEnum.STAFF]: [
        PermissionEnum.MANAGE_SCHEDULE,
        PermissionEnum.MANAGE_APPOINTMENTS
    ]
};