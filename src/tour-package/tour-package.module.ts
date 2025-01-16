import { Module } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { TourPackageController } from './tour-package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { Introduction } from './entities/Introduction.model';
import { TourPlan } from './entities/tourPlan.Model';
import { TourPackage } from './entities/tourPackage.model';
import { VisitPlaceImage } from './entities/visitPlaceImage.model';
import { MainImage } from './entities/mainImage.model';

@Module({
  imports: [TypeOrmModule.forFeature([Admin,Introduction,TourPlan,TourPackage,VisitPlaceImage,MainImage])],
  controllers: [TourPackageController],
  providers: [TourPackageService],
})
export class TourPackageModule {}
