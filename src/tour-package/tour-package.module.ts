import { Module } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { TourPackageController } from './tour-package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourPackage } from './entities/tour-package.entity';
import { Introduction } from './entities/Introduction.model';
import { Overview } from './entities/overview.model';
import { MetaInfo } from './entities/metaInfo.model';
import { MainImage } from './entities/mainImage.model';
import { VisitPlace } from './entities/visitPlace.model';
import { Objectives } from './entities/objective.model';
import { TourPlan } from './entities/tourPlan.Model';
import { AdminModule } from 'src/admin/admin.module';
import { Admin } from 'src/admin/entities/admin.entity';

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
      Admin
      
    ]),
   
  ],
  controllers: [TourPackageController],
  providers: [TourPackageService],
})
export class TourPackageModule {}
