import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TourPackage } from './entities/tour-package.entity';
import { Introduction } from './entities/Introduction.model';
import {
  CreateIntroductionDto,
  CreateOverviewDto,
  CreateTourPackageDto,
} from './dto/create-tour-package.dto';
import { Overview } from './entities/overview.model';
import { MulterFile } from './mutlar/multer-file.interface';
import { MainImage } from './entities/mainImage.model';
import { VisitPlace } from './entities/visitPlace.model';

@Injectable()
export class TourPackageService {
  constructor(
    @InjectRepository(TourPackage)
    private tourPackageRepository: Repository<TourPackage>,
    @InjectRepository(Introduction)
    private readonly introductionRepository: Repository<Introduction>,
    @InjectRepository(Overview)
    private readonly overviewRepository: Repository<Overview>,
    @InjectRepository(MainImage)
    private readonly mainImageRepository: Repository<MainImage>,
    @InjectRepository(VisitPlace)
    private readonly visitPlaceRepository: Repository<VisitPlace>,
  ) {}

  async createIntorduction(
    createIntroductionDto: CreateIntroductionDto,
  ): Promise<Introduction> {
    const add2 = await this.introductionRepository.findOne({
      where: { mainTitle: createIntroductionDto.mainTitle },
    });
    if (add2) {
      throw new ConflictException('The title is invalid');
    }
    const add: Introduction = new Introduction();
    add.mainTitle = createIntroductionDto.mainTitle;
    add.subTitle = createIntroductionDto.subTitle;
    add.tripType = createIntroductionDto.tripType;
    add.journeyDuration = createIntroductionDto.journeyDuration;
    add.startDate = createIntroductionDto.startDate;
    add.endDate = createIntroductionDto.endDate;
    add.countryName = createIntroductionDto.countryName;
    add.cityName = createIntroductionDto.cityName;
    add.journeyLocation = createIntroductionDto.journeyLocation;
    add.totalSeat = createIntroductionDto.totalSeat;
    add.minimumAge = createIntroductionDto.minimumAge;
    add.maximumAge = createIntroductionDto.maximumAge;
    add.packagePrice = createIntroductionDto.packagePrice;
    add.packageDiscount = createIntroductionDto.packageDiscount;
    return await this.introductionRepository.save(add);
  }

  async createOverview(createOverviewDto: CreateOverviewDto) {
    const add: Overview = new Overview();
    add.packageOverview = createOverviewDto.packageOverview;
    add.packageInclude = createOverviewDto.packageInclude;
    return this.overviewRepository.save(add);
  }

  async createMainImage(file: MulterFile): Promise<MainImage> {
    if (!file) {
      throw new NotFoundException('No picture file found');
    }
    if (!file.filename || !file.path || file.size === undefined) {
      throw new NotAcceptableException('Invalid file data');
    }
    const picture = new MainImage();
    picture.mainTitle = file.filename;
    picture.path = file.path;
    picture.size = file.size;
    try {
      return await this.mainImageRepository.save(picture);
    } catch (error) {
      throw new Error('Failed to save main image');
    }
  }

  async createVisitImage(file: MulterFile): Promise<VisitPlace> {
    if (!file) {
      throw new NotFoundException('No picture file found');
    }

    if (!file.filename || !file.path || file.size === undefined) {
      throw new NotAcceptableException('Invalid file data');
    }

    const picture = new VisitPlace();
    picture.pictureName = file.filename;
    picture.path = file.path;
    picture.size = file.size;
    try {
      return await this.visitPlaceRepository.save(picture);
    } catch (error) {
      throw new Error('Failed to save main image');
    }
  }

  async create(
    createTourPackageDto: CreateTourPackageDto,
  ): Promise<TourPackage> {
    const { introduction } = createTourPackageDto;
    const existingIntroduction = await this.introductionRepository.findOne({
      where: { mainTitle: introduction.mainTitle },
    });

    if (existingIntroduction) {
      throw new ConflictException(
        'Introduction with the same mainTitle already exists',
      );
    }
    const tourPackage = this.tourPackageRepository.create(createTourPackageDto);
    return this.tourPackageRepository.save(tourPackage);
  }

  async findAll(): Promise<TourPackage[]> {
    const tourPackages = await this.tourPackageRepository.find({
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
    return tourPackages;
  }
}
