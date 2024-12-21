import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IpService } from 'src/ip/ip.service';
export declare class RateLimiterMiddleware implements NestMiddleware {
    private readonly ipService;
    private rateLimits;
    constructor(ipService: IpService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
