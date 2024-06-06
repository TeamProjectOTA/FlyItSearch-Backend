/// <reference types="multer" />
import { TourpackageService } from './tourpackage.service';
import { Tourpackage, TourpackageDto } from './tourpackage.model';
export declare class TourpackageController {
    private readonly tourpackageService;
    constructor(tourpackageService: TourpackageService);
    create(tourpackageDto: TourpackageDto, file: Express.Multer.File): Promise<Tourpackage>;
    findAllFlight(): Promise<Tourpackage[]>;
    findAll(): Promise<Tourpackage[]>;
}
