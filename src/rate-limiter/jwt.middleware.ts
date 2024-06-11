import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { jwtConstants } from 'src/auth/jwt.constaints';


@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      req.user = { role: 'unregistered' }; // Treat as unregistered if no auth header
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      req.user = { role: 'unregistered' }; // Treat as unregistered if no token
      return next();
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
      
      
      const emailOrUUID = decoded.sub;

    
      const user = await this.authService.getUserByEmail(emailOrUUID).catch(() => null);
      if (user) {
        req.user = { email: user.email, role: user.role };
        return next();
      }

      
      const admin = await this.authService.getAdminByUUID(emailOrUUID).catch(() => null);
      if (admin) {
        req.user = { uuid: admin.uuid, role: admin.role };
        return next();
      }

    
      throw new UnauthorizedException('User or Admin not found');
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
