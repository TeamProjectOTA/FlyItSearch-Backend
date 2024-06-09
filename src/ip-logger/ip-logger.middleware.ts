import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['clientIp'] =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    next();
  }
}
