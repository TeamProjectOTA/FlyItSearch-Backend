import { Module } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { TourPackageController } from './tour-package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourPackage } from './entities/tour-package.entity';

@Module({imports:[TypeOrmModule.forFeature([TourPackage])],
  controllers: [TourPackageController],
  providers: [TourPackageService],
})
export class TourPackageModule {}
