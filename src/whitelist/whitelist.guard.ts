import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class WhitelistGuard implements CanActivate {
  private readonly allowedIPs: string[] = ['127.0.0.1', '']; // Add normalized IPv4 addresses here

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    
    let clientIP = (request.headers['x-forwarded-for'] as string) || request.socket.remoteAddress;

   
    if (clientIP.startsWith('::ffff:')) {
      clientIP = clientIP.replace('::ffff:', '');
    }    
    if (clientIP === '::1') {
      clientIP = '127.0.0.1';
    }
    if (!this.allowedIPs.includes(clientIP)) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}
