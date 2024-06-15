import { Injectable } from '@nestjs/common';
import { CreateTourPackageDto, TripType } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TourPackage } from './entities/tour-package.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TourPackageService {
  constructor(
    @InjectRepository(TourPackage)
    private readonly tourPackageRepository: Repository<TourPackage>,
  ){}
  async create(createTourPackageDto: CreateTourPackageDto): Promise<TourPackage> {
    const tourPackage = new TourPackage();
    tourPackage.mainTitle = createTourPackageDto.mainTitle;
    tourPackage.subTitle = createTourPackageDto.subTitle;
    tourPackage.tripType = createTourPackageDto.tripType;
    tourPackage.journeyDuration = createTourPackageDto.journeyDuration;

    const startDate = new Date(createTourPackageDto.startDate);
    const endDate = new Date(createTourPackageDto.endDate);
    
    tourPackage.startDate = `${this.formatDate(startDate)} (${this.getDayOfWeek(startDate)})`;
    tourPackage.endDate = `${this.formatDate(endDate)} (${this.getDayOfWeek(endDate)})`;

    tourPackage.countryName = createTourPackageDto.countryName;
    tourPackage.cityName = createTourPackageDto.cityName;
    tourPackage.journeyLocation = createTourPackageDto.journeyLocation;
    tourPackage.totalSeat = createTourPackageDto.totalSeat;
    tourPackage.maximunAge = createTourPackageDto.maximunAge;
    tourPackage.minimumAge = createTourPackageDto.minimumAge;
    tourPackage.packagePrice = createTourPackageDto.packagePrice;
    tourPackage.packageDiscount = createTourPackageDto.packageDiscount;
    tourPackage.packageOverview = createTourPackageDto.packageOverview;

    return this.tourPackageRepository.save(tourPackage);
  }

  private getDayOfWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getUTCDay()];
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  }


  findAll() {
    return `This action returns all tourPackage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tourPackage`;
  }

  update(id: number, updateTourPackageDto: UpdateTourPackageDto) {
    return `This action updates a #${id} tourPackage`;
  }

  remove(id: number) {
    return `This action removes a #${id} tourPackage`;
  }
}
