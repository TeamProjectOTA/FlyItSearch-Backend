import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { HotDeals } from './hotdeals.model';
import { HotDealsService } from './hotdeals.service';
import { HotDealsController } from './hotdeals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HotDeals])],
  providers: [HotDealsService],
  controllers: [HotDealsController],
})
export class HotDealsModule {}
