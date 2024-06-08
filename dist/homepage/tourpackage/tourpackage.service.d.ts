import { Tourpackage, TourpackageDto } from './tourpackage.model';
import { Repository } from 'typeorm';
export declare class TourpackageService {
    private readonly tourPacageRepository;
    constructor(tourPacageRepository: Repository<Tourpackage>);
    create(tourPackageDto: TourpackageDto, paths: string[], fileDetails: {
        path: string;
        size: number;
    }[]): Promise<Tourpackage>;
    findOne(category: string): Promise<Tourpackage[]>;
    Delete(title: string): Promise<{
        findDeals: Tourpackage;
        deleteDeals: import("typeorm").DeleteResult;
    }>;
}
