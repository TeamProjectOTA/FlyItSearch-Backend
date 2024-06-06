import { Module } from '@nestjs/common';
import { TourpackageService } from './tourpackage.service';
import { TourpackageController } from './tourpackage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tourpackage } from './tourpackage.model';

@Module({
  imports: [TypeOrmModule.forFeature([Tourpackage])],
  providers: [TourpackageService],
  controllers: [TourpackageController],
})
export class TourpackageModule {}
