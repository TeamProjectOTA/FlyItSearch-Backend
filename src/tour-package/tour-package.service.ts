import { Injectable } from '@nestjs/common';
import { TourPackage } from './entities/tourPackage.model';
import { CreateTourPackageDto } from './dto/tourPackage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class TourPackageService {
  constructor(
    @InjectRepository(TourPackage)
  private readonly tourPackageRepository: Repository<TourPackage>,) {}
  async create(createTourPackageDto: CreateTourPackageDto): Promise<TourPackage> {
  
    const packageId = `PKG${Math.floor(Math.random() * 1000000)}`;

    
    const newTourPackage = this.tourPackageRepository.create({
      ...createTourPackageDto,
      packageId, 
    });

    
    return this.tourPackageRepository.save(newTourPackage);
  }

}
