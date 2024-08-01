import {
  ConflictException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
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
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class TourPackageService {
  // private readonly logger = new Logger(TourPackageService.name);
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
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
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

  async findAll(uuid: string): Promise<any> {
    const findadmin = await this.adminRepository.findOne({ where: { uuid } });
    if (!findadmin) {
      throw new UnauthorizedException();
    }

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
  async delete(id: number): Promise<any> {
    const result = await this.tourPackageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TourPackage with ID "${id}" not found`);
    }
  }

  async findAllByCriteria(criteria: {
    mainTitle?: string;
    countryName?: string;
    cityName?: string;
    metaKeywords?: string[];
    startDate?: string;
  }): Promise<TourPackage[]> {
    const { mainTitle, countryName, cityName, metaKeywords, startDate } =
      criteria;

    const query = this.tourPackageRepository
      .createQueryBuilder('tourPackage')
      .leftJoinAndSelect('tourPackage.introduction', 'introduction')
      .leftJoinAndSelect('tourPackage.overview', 'overview')
      .leftJoinAndSelect('tourPackage.mainImage', 'mainImage')
      .leftJoinAndSelect('tourPackage.visitPlace', 'visitPlace')
      .leftJoinAndSelect('tourPackage.tourPlan', 'tourPlan')
      .leftJoinAndSelect('tourPackage.objectives', 'objectives')
      .leftJoinAndSelect('tourPackage.metaInfo', 'metaInfo');

    if (mainTitle) {
      query.andWhere('introduction.mainTitle LIKE :mainTitle', {
        mainTitle: `%${mainTitle}%`,
      });
    }
    if (countryName) {
      query.andWhere('introduction.countryName = :countryName', {
        countryName,
      });
    }
    if (cityName) {
      query.andWhere('introduction.cityName = :cityName', { cityName });
    }
    if (startDate) {
      query.andWhere('introduction.startDate LIKE :startDate', {
        startDate: `%${startDate}`,
      });
    }
    if (metaKeywords && metaKeywords.length > 0) {
      const keywordConditions: string[] = metaKeywords.map((keyword, index) => {
        return `FIND_IN_SET(:keyword${index}, metaInfo.metaKeywords)`;
      });
      query.andWhere(
        `(${keywordConditions.join(' OR ')})`,
        metaKeywords.reduce((acc, keyword, index) => {
          acc[`keyword${index}`] = keyword.trim();
          return acc;
        }, {}),
      );
    }

    const tourPackages = await query.getMany();

    if (tourPackages.length === 0) {
      throw new NotFoundException('Tour packages not found');
    }

    return tourPackages;
  }
}
