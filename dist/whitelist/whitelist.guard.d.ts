import { CanActivate, ExecutionContext } from '@nestjs/common';
import { WhitelistService } from './whitelist';
export declare class WhitelistGuard implements CanActivate {
    private readonly whitelistService;
    constructor(whitelistService: WhitelistService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
