import { createParamDecorator } from '@nestjs/common';
import { User } from '../entities/user.entity';

/**
 * Decorator that retrieves the user object from the request.
 * @param data - Additional data passed to the decorator (optional).
 * @param ctx - The execution context.
 * @returns The user object from the request.
 */
export const GetUser = createParamDecorator((data, ctx): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
