import { TourPackageService } from './tour-package.service';
import { CreateIntroductionDto, CreateOverviewDto, CreateTourPackageDto } from './dto/create-tour-package.dto';
import { MulterFile } from './mutlar/multer-file.interface';
import { TourPackage } from './entities/tour-package.entity';
export declare class TourPackageController {
    private readonly tourPackageService;
    private readonly logger;
    constructor(tourPackageService: TourPackageService);
    createIntroduction(createIntroductionDto: CreateIntroductionDto): Promise<import("./entities/Introduction.model").Introduction>;
    createOverview(createOverviewDto: CreateOverviewDto): Promise<import("./entities/overview.model").Overview>;
    uploadPicturesmain(files: MulterFile[]): Promise<any>;
    uploadPicturesVisit(files: MulterFile[]): Promise<any>;
    create(createTourPackageDtoArray: CreateTourPackageDto[]): Promise<any>;
    findAll(uuid: string): Promise<any>;
    delete(id: number): Promise<any>;
    findAllByCriteria(mainTitle?: string, countryName?: string, cityName?: string, metaKeywords?: string, startDate?: string): Promise<TourPackage[]>;
}
