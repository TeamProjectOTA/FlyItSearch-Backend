import { TourPackage } from './entities/tourPackage.model';
import { TourPackageService } from './tour-package.service';
import { CreateTourPackageDto } from './dto/tourPackage.dto';
export declare class TourPackageController {
    private readonly tourPackageService;
    constructor(tourPackageService: TourPackageService);
    create(createTourPackageDto: CreateTourPackageDto): Promise<TourPackage>;
}
