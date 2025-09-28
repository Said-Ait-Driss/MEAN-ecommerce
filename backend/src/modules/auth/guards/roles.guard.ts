import { CanActivate, ExecutionContext, Injectable, forwardRef, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const token = request.headers?.authorization || request.query?.Authorization || request.cookies?.token;
        if (!token) return false;
        const decodded = await this.authService.verifyJWT(token);
        if (!decodded) {
            return false;
        }

        const user = request.user || (await this.authService.getSourceFromJWT(token));
        if (!user) {
            return false;
        }
        if (!request.user) request.user = user;
        if (!request.authUser) request.authUser = request.authUser || decodded;
        if (!request.jwToken) request.jwToken = token;

        return requiredRoles.includes(user.role) || requiredRoles.includes(user.role.toUpperCase());
    }
}
