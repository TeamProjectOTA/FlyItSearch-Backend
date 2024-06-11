import { NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
export declare class JwtMiddleware implements NestMiddleware {
    private readonly jwtService;
    private readonly authService;
    constructor(jwtService: JwtService, authService: AuthService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
