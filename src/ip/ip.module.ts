import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpService } from './ip.service';
import { IpAddress } from './ip.model';
import { ScheduleModule } from '@nestjs/schedule';
import { IpCleanupService } from './ip-cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([IpAddress]),ScheduleModule.forRoot(),],
  providers: [IpService, IpCleanupService],
  exports: [IpService, IpCleanupService],
})
export class IpModule {}
