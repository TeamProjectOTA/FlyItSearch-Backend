import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IpService } from 'src/ip/ip.service';
import { AuthService } from 'src/auth/auth.service';
import { jwtConstants } from 'src/auth/jwt.constaints';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(
    private readonly ipService: IpService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const xForwardedFor = request.headers['x-forwarded-for'];
    //console.log(request)
    let ip: string;
    if (typeof xForwardedFor === 'string') {
      ip = xForwardedFor.split(',')[0];
    } else if (Array.isArray(xForwardedFor)) {
      ip = xForwardedFor[0];
    } else {
      ip = request.socket.remoteAddress || '';
    }
    let userRole = 'unregistered';
    let email: string | null = null;

    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.secret,
          });

          const emailOrUUID = decoded.sub;
          const user = await this.authService
            .getUserByEmail(emailOrUUID)
            .catch(() => null);

          if (user) {
            userRole = user.role;
            email = user.email;
          } else {
            const admin = await this.authService
              .getAdminByUUID(emailOrUUID)
              .catch(() => null);

            if (admin) {
              userRole = admin.role;
              email = null;
            }
          }
        } catch (err) {
          throw new UnauthorizedException('Invalid or expired token');
        }
      }
    }

    const rateLimits = {
      unregistered: { points: 15, duration: 86400 },
      registered: { points: 60, duration: 86400 },
      admin: { points: Number.MAX_SAFE_INTEGER, duration: 86400 },
      superAdmin: { points: Number.MAX_SAFE_INTEGER, duration: 86400 },
    };

    const { points, duration } =
      rateLimits[userRole] || rateLimits.unregistered;
    const currentTime = Date.now();

    try {
      let ipAddress = await this.ipService.findOne(ip);

      if (ipAddress) {
        if (ipAddress.role !== userRole) {
          ipAddress.points = points - 1;
          ipAddress.role = userRole;
          ipAddress.lastRequestTime = currentTime;
        } else if (ipAddress.lastRequestTime + duration * 1000 > currentTime) {
          if (ipAddress.points > 0) {
            ipAddress.points -= 1;
          } else {
            throw new HttpException(
              userRole === 'registered'
                ? 'Your search limit is exceeded for today. Contact help-line.'
                : 'Sign up to get more searches.',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }
        } else {
          ipAddress.points = points - 1;
          ipAddress.lastRequestTime = currentTime;
        }
      } else {
        ipAddress = await this.ipService.create(
          ip,
          userRole,
          points - 1,
          currentTime,
          email,
        );
      }

      // Update or create the IP record in the database
      await this.ipService.createOrUpdate(
        ip,
        userRole,
        ipAddress.points,
        currentTime,
        email,
      );

      return true; // Allow the request
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}
