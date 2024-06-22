/// <reference types="multer" />
import { TourPackageService } from './tour-package.service';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
export declare class TourPackageController {
    private readonly tourPackageService;
    constructor(tourPackageService: TourPackageService);
    create(createTourPackageDto: CreateTourPackageDto, files: Express.Multer.File[]): Promise<import("./entities/tour-package.entity").TourPackage>;
    findAll(): Promise<import("./entities/tour-package.entity").TourPackage[]>;
}
