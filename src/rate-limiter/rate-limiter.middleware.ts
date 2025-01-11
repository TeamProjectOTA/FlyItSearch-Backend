import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IpService } from 'src/ip/ip.service';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private rateLimits = {
    unregistered: { points: 25, duration: 86400 * 1000 },
    registered: { points: 70, duration: 86400 * 1000 },
    admin: { points: Number.MAX_SAFE_INTEGER, duration: 86400 * 1000 },
    superAdmin: { points: Number.MAX_SAFE_INTEGER, duration: 86400 * 1000 },
  };

  constructor(private readonly ipService: IpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const xForwardedFor = req.headers['x-forwarded-for'] as string;
    const ipList = xForwardedFor?.split(',').map((ip) => ip.trim());
    const userIp = ipList?.[0] || req.socket.remoteAddress;
    const ip = userIp?.startsWith('::ffff:') ? userIp.substring(7) : userIp;
    const userRole = req.user?.role || 'unregistered';
    const email = req.user?.email;

    const { points, duration } = this.rateLimits[userRole];

    try {
      let ipAddress: any;

      if (email) {
        ipAddress = await this.ipService.findByEmail(email);
      }

      if (!ipAddress) {
        ipAddress = await this.ipService.findOne(ip);
      }

      const currentTime = Date.now();

      if (ipAddress) {
        if (ipAddress.role !== userRole) {
          ipAddress.points = points - 1;
          ipAddress.role = userRole;
          ipAddress.lastRequestTime = currentTime;
        } else if (ipAddress.lastRequestTime + duration > currentTime) {
          if (ipAddress.points > 0) {
            ipAddress.points -= 1;
          } else {
            throw new Error('Rate limit exceeded');
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
      await this.ipService.createOrUpdate(
        ipAddress.ip,
        userRole,
        ipAddress.points,
        currentTime,
        email,
      );

      next();
    } catch (error) {
      if (userRole === 'registered') {
        res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          message:
            'Your search limit has been exceeded for today. Please contact the help desk.',
        });
      } else if (userRole === 'unregistered') {
        res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          message: 'Sign up to get more searches.',
        });
      } else {
        res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          message: 'Rate limit exceeded. Please try again later.',
        });
      }
    }
  }
}
