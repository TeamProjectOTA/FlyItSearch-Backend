import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpService } from './ip.service';
import { IpAddress } from './ip.model';
import { ScheduleModule } from '@nestjs/schedule';
import { IpCleanupService } from './ip-cleanup.service';
import { IpController } from './ip.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([IpAddress]), AuthModule],
  providers: [IpService, IpCleanupService],
  exports: [IpService, IpCleanupService],
  controllers: [IpController],
})
export class IpModule {}
