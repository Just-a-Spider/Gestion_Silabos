import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

/**
 * Defines a decorator function that can be used to assign roles to a specific resource or endpoint.
 * Works in conjunction with the RolesGuard to check if the user has the required roles.
 * @param roles - An array of user roles that are allowed to access the resource or endpoint.
 * @returns A decorator function that sets the metadata for the roles.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
