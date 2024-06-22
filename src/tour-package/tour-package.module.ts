import { Module } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { TourPackageController } from './tour-package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Introduction, TourPackage,Overview,MainImage,VisitPlace,TourPlan,Objectives,MetaInfo } from './entities/tour-package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TourPackage,Introduction,Overview,MainImage,VisitPlace,TourPlan,Objectives,MetaInfo])],
  controllers: [TourPackageController],
  providers: [TourPackageService],
})
export class TourPackageModule {}
