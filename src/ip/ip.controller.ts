import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { IpService } from './ip.service';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';

@ApiTags('SearchCount')
@Controller('SearchCount')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  //@UseGuards(AdmintokenGuard)
  @Patch('admin/updatelimit/:email/:points')
  async searchCount(
    @Param('email') email: string,
    @Param('points') points: number,
  ) {
    return await this.ipService.update(email, points);
  }
  @Get("/ipcheck")
  getRequestInfo(@Req() request: Request): any {
    const xForwardedFor = request.headers['x-forwarded-for'] as string;
    const ipList = xForwardedFor?.split(',').map(ip => ip.trim());
    const userIp = ipList?.[0] || request.socket.remoteAddress; // Use the first IP or fallback
    
    return {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      ip: userIp,
      query: request.query,
      params: request.params,
      xForwardedFor: xForwardedFor || 'Not Available', 
    };
  }
}
