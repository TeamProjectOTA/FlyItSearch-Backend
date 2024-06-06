import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tourpackage, TourpackageDto } from './tourpackage.model';
import { Repository } from 'typeorm';

@Injectable()
export class TourpackageService {
  constructor(
    @InjectRepository(Tourpackage)
    private readonly tourPacageRepository: Repository<Tourpackage>,
  ) {}
  async create(
    tourPackageDto: TourpackageDto,
    path: string,
  ): Promise<Tourpackage> {
    const packageTitle = await this.tourPacageRepository.findOne({
      where: { title: tourPackageDto.title },
    });
    if (packageTitle) {
      throw new ConflictException('Title already existed');
    }
    const newPackage = new Tourpackage();
    newPackage.title = tourPackageDto.title;
    newPackage.category = tourPackageDto.category;
    newPackage.date = tourPackageDto.date;
    newPackage.description = tourPackageDto.description;
    newPackage.picture = path;
    const savedPackage = await this.tourPacageRepository.save(newPackage);

  
  if (!savedPackage) {
    throw new InternalServerErrorException('Failed to save tour package');
  }
    return savedPackage;
  }
  async findOne(title: string) {
    let packagefind = await this.tourPacageRepository.findOne({
      where: { title: title },
    });
    if (!packagefind) {
      throw new NotFoundException();
    }
    return packagefind;
  }
  async findByFlight(category: string) {
    return await this.tourPacageRepository.find({
      where: { category: category },
    });
  }
  async findAll()
  {return await this.tourPacageRepository.find()}
}
