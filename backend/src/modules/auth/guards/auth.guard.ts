import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
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
        if (!request.authUser) request.authUser = decodded;
        if (!request.jwToken) request.jwToken = token;
        return true;
    }
}
