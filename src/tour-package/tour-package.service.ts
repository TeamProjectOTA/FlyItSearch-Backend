import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { TourPackage } from './entities/tour-package.entity';

@Injectable()
export class TourPackageService {
  constructor(
    @InjectRepository(TourPackage)
    private tourPackageRepository: Repository<TourPackage>,
  ) {}

  async create(
    createTourPackageDto: CreateTourPackageDto,
  ): Promise<TourPackage> {
    const tourPackage = this.tourPackageRepository.create(createTourPackageDto);
    return this.tourPackageRepository.save(tourPackage);
  }

  async findAll(): Promise<TourPackage[]> {
    return this.tourPackageRepository.find({
      relations: [
        'introduction',
        'overview',
        'mainImage',
        'visitPlace',
        'tourPlan',
        'objectives',
        'metaInfo',
      ],
    });
  }
}
