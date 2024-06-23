import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TourPackage } from './entities/tour-package.entity';

@Injectable()
export class TourPackageService {
  constructor(
    @InjectRepository(TourPackage)
    private tourPackageRepository: Repository<TourPackage>,
  ) {}

  async create(tourPackageData: Partial<TourPackage>): Promise<TourPackage> {
    const tourPackage = this.tourPackageRepository.create(tourPackageData);
    return await this.tourPackageRepository.save(tourPackage);
  }

  async findAll(): Promise<TourPackage[]> {
    return this.tourPackageRepository.find({
      relations: ['introduction', 'overview', 'mainImage', 'visitPlace', 'tourPlan', 'objectives', 'metaInfo'],
    });
  }

  
}