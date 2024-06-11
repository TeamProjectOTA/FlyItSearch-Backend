import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiterByRole = {
  unregistered: new RateLimiterMemory({
    points: 10, 
    duration: 86400, 
  }),
  registered: new RateLimiterMemory({
    points: 100, 
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
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const userRole = req.user?.role || 'unregistered'; 
    const day = Date.now()

    const rateLimiter = rateLimiterByRole[userRole] || rateLimiterByRole.unregistered;

    rateLimiter.consume(ip)
      .then(() => {
        next();
      })
      .catch(() => {
        const resetTime = new Date(Date.now() + 86400 * 1000); 
        const resetTimeString = resetTime.toLocaleString(); 
        res.status(HttpStatus.TOO_MANY_REQUESTS).json({ message: `Limit over for today. Try again at ${resetTimeString}` });
      });
  }
}
