import { CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthService } from "./auth.service";
export declare class BothTokensGuard implements CanActivate {
    private readonly authService;
    constructor(authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}