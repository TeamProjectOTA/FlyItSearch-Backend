import { Repository } from 'typeorm';
import { TourPackage } from './entities/tour-package.entity';
import { Introduction } from './entities/Introduction.model';
import { CreateIntroductionDto, CreateOverviewDto, CreateTourPackageDto } from './dto/create-tour-package.dto';
import { Overview } from './entities/overview.model';
import { MulterFile } from './mutlar/multer-file.interface';
import { MainImage } from './entities/mainImage.model';
import { VisitPlace } from './entities/visitPlace.model';
export declare class TourPackageService {
    private tourPackageRepository;
    private readonly introductionRepository;
    private readonly overviewRepository;
    private readonly mainImageRepository;
    private readonly visitPlaceRepository;
    constructor(tourPackageRepository: Repository<TourPackage>, introductionRepository: Repository<Introduction>, overviewRepository: Repository<Overview>, mainImageRepository: Repository<MainImage>, visitPlaceRepository: Repository<VisitPlace>);
    createIntorduction(createIntroductionDto: CreateIntroductionDto): Promise<Introduction>;
    createOverview(createOverviewDto: CreateOverviewDto): Promise<Overview>;
    createMainImage(file: MulterFile): Promise<MainImage>;
    createVisitImage(file: MulterFile): Promise<VisitPlace>;
    create(createTourPackageDto: CreateTourPackageDto): Promise<TourPackage>;
    findAll(): Promise<TourPackage[]>;
    delete(id: number): Promise<any>;
    findAllByCriteria(criteria: {
        mainTitle?: string;
        countryName?: string;
        cityName?: string;
        metaKeywords?: string[];
        startDate?: string;
    }): Promise<TourPackage[]>;
}
