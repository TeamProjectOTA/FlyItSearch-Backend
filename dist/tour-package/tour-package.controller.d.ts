import { TourPackageService } from './tour-package.service';
export declare class TourPackageController {
    private readonly tourPackageService;
    constructor(tourPackageService: TourPackageService);
    findAll(): Promise<import("./entities/tour-package.entity").TourPackage[]>;
}
