import { Repository } from 'typeorm';
import { TourPackage } from './entities/tour-package.entity';
export declare class TourPackageService {
    private tourPackageRepository;
    constructor(tourPackageRepository: Repository<TourPackage>);
    create(tourPackageData: Partial<TourPackage>): Promise<TourPackage>;
    findAll(): Promise<TourPackage[]>;
}
