import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpAddressService } from '../ip-address/ip-address.service';
import { AuthModule } from '../auth/auth.module';
import { IpAddress } from './ip-address.model';
import { RateLimitingPipe } from 'src/rate-limiting/rate-limiting.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([IpAddress]), AuthModule],
  providers: [IpAddressService, RateLimitingPipe],
  exports: [RateLimitingPipe, IpAddressService],
})
export class RateLimitingModule {}
