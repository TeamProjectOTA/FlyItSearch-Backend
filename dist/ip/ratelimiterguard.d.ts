import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IpService } from 'src/ip/ip.service';
import { AuthService } from 'src/auth/auth.service';
export declare class RateLimiterGuard implements CanActivate {
    private readonly ipService;
    private readonly jwtService;
    private readonly authService;
    constructor(ipService: IpService, jwtService: JwtService, authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
