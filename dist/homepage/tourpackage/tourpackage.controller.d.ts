/// <reference types="multer" />
import { TourpackageService } from './tourpackage.service';
import { Tourpackage, TourpackageDto } from './tourpackage.model';
export declare class TourpackageController {
    private readonly tourpackageService;
    private counter;
    constructor(tourpackageService: TourpackageService);
    create(tourpackageDto: TourpackageDto, files: Express.Multer.File[]): Promise<Tourpackage>;
    findOne(category: string): Promise<Tourpackage[]>;
    Delete(title: string): Promise<{
        findDeals: Tourpackage;
        deleteDeals: import("typeorm").DeleteResult;
    }>;
}
