import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { IpAddressService } from '../ip-address/ip-address.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RateLimitingPipe implements PipeTransform {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly ipAddressService: IpAddressService,
  ) {}

  async transform(request: Request, metadata: ArgumentMetadata) {
    const ip = request.ip;

    let limit = 10; // Default limit for unregistered users
    const headers = request.headers;

    // Check if the authorization header is present
    if (headers.authorization) {
      const authHeader = headers.authorization;
      let user: any;

      try {
        user = await this.authService.verifyUserToken({ authorization: authHeader });
      } catch (err) {
        try {
          user = await this.authService.verifyAdminToken({ authorization: authHeader });
        } catch (err) {
          // If verification fails, treat as unregistered
          user = null;
        }
      }

      if (user) {
        if (user instanceof Admin) {
          // Admin has unlimited access
          return request;
        } else if (user instanceof User) {
          limit = 100; // Limit for registered users
        }
      }
    }

    const currentCount = await this.ipAddressService.getCount(ip);

    if (currentCount >= limit) {
      throw new BadRequestException('Rate limit exceeded');
    }

    await this.ipAddressService.incrementCount(ip);

    return request;
  }
}
