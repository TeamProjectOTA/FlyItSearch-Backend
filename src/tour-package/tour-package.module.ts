import { Module } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { TourPackageController } from './tour-package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TourPackage,
  MainImage,
  VisitPlace,
  TourPlan,
  Objectives,
} from './entities/tour-package.entity';
import { Introduction } from './entities/Introduction.model';
import { Overview } from './entities/overview.model';
import { MetaInfo } from './entities/metaInfo.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TourPackage,
      Introduction,
      Overview,
      MainImage,
      VisitPlace,
      TourPlan,
      Objectives,
      MetaInfo,
    ]),
  ],
  controllers: [TourPackageController],
  providers: [TourPackageService],
})
export class TourPackageModule {}
