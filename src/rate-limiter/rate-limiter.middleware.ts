import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { IpService } from 'src/ip/ip.service';

const rateLimiterByRole = {
  unregistered: new RateLimiterMemory({
    points: 10,
    duration: 86400,
  }),
  registered: new RateLimiterMemory({
    points: 50,
    duration: 86400,
  }),
  admin: new RateLimiterMemory({
    points: Number.MAX_SAFE_INTEGER,
    duration: 86400,
  }),
  superAdmin: new RateLimiterMemory({
    points: Number.MAX_SAFE_INTEGER,
    duration: 86400,
  }),
};

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(private readonly ipService: IpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const userRole = req.user?.role || 'unregistered';

    const rateLimiter =
      rateLimiterByRole[userRole] || rateLimiterByRole.unregistered;

    try {
      await rateLimiter.consume(ip);

      if (userRole !== 'unregistered') {
        const currentTime = Date.now();
        const duration = 86400 * 1000;

        let ipAddress = await this.ipService.findOne(ip);

        if (ipAddress) {
          if (ipAddress.role !== userRole) {
            ipAddress.points = rateLimiter.points - 1;
            ipAddress.role = userRole;
            ipAddress.lastRequestTime = currentTime;
          } else if (ipAddress.lastRequestTime + duration > currentTime) {
            ipAddress.points = Math.max(ipAddress.points - 1, 0);
          } else {
            ipAddress.points = rateLimiter.points - 1;
            ipAddress.lastRequestTime = currentTime;
          }
        } else {
          ipAddress = await this.ipService.create(
            ip,
            userRole,
            rateLimiter.points - 1,
            currentTime,
          );
        }
        await this.ipService.createOrUpdate(
          ip,
          userRole,
          ipAddress.points,
          currentTime,
        );
      }

      next();
    } catch {
      if (userRole == 'registered') {
        res
          .status(HttpStatus.TOO_MANY_REQUESTS)
          .json({
            message:
              'Your Search limit is exited for today. Contect with help-line ',
          });
      } else if (userRole == 'unregistered') {
        res
          .status(HttpStatus.TOO_MANY_REQUESTS)
          .json({ message: 'Sign up to get more search ' });
      }
    }
  }
}
