import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { WhitelistService } from './whitelist';

@Injectable()
export class WhitelistGuard implements CanActivate {
  constructor(private readonly whitelistService: WhitelistService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    let clientIP =
      (request.headers['x-forwarded-for'] as string) ||
      request.socket.remoteAddress;

    if (clientIP.startsWith('::ffff:')) {
      clientIP = clientIP.replace('::ffff:', '');
    }
    if (clientIP.startsWith('::')) {
      clientIP = clientIP.replace('::', '');
    }

    const allowedIPs = await this.whitelistService.findAll();

    if (!allowedIPs.includes(clientIP)) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}
