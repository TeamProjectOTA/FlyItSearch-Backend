import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class WhitelistGuard implements CanActivate {
    private readonly allowedIPs;
    canActivate(context: ExecutionContext): boolean;
}
