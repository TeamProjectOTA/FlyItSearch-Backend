import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IpService } from './ip.service';

@Injectable()
export class IpCleanupService {
  constructor(private readonly ipService: IpService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanup() {
    const currentTime = Date.now();
    const duration = 86400 * 1000; // 24 hours in milliseconds
    await this.ipService.cleanupOldIps(currentTime - duration);
  }
}
