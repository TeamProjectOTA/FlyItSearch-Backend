import { Inject, Injectable } from '@nestjs/common';
import { TourPackage } from './entities/tourPackage.model';
import { CreateTourPackageDto } from './dto/tourPackage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Introduction } from './entities/Introduction.model';
import { TourPlan } from './entities/tourPlan.Model';
import { DoSpacesServiceLib } from 'src/uploads/upload.provider.service';

@Injectable()
export class TourPackageService {
  constructor(
    @InjectRepository(TourPackage)
  private readonly tourPackageRepository: Repository<TourPackage>,
  @InjectRepository(Introduction)
  private readonly introductionRepository: Repository<Introduction>,
  @InjectRepository(TourPlan)
  private readonly tourPlanRepository: Repository<TourPlan>,
   
) {}
async create(createTourPackageDto: CreateTourPackageDto): Promise<TourPackage> {
  const packageId = `PKG${Math.floor(Math.random() * 1000000)}`; 
  const tourPackage = this.tourPackageRepository.create({
    packageId, 
    ...createTourPackageDto, 
  });

  const savedTourPackage = await this.tourPackageRepository.save(tourPackage);
  if (createTourPackageDto.introduction) {
    const introduction = this.introductionRepository.create({
      ...createTourPackageDto.introduction,
      tourPackage: savedTourPackage, 
    });
    await this.introductionRepository.save(introduction);
  }
  if (createTourPackageDto.tourPlans && createTourPackageDto.tourPlans.length) {
    for (const plan of createTourPackageDto.tourPlans) {
      const tourPlan = this.tourPlanRepository.create({
        ...plan,
        tourPackage: savedTourPackage, 
      });
      await this.tourPlanRepository.save(tourPlan);
    }
  }

  return savedTourPackage;
}

  
  async findAll(): Promise<any> {
    return this.tourPackageRepository.find(
      {
      relations: ['introduction', 'tourPlans','mainImage','visitPlaceImage'], 
    }
  );
  }
}


