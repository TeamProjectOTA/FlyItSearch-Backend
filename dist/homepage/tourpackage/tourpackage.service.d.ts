import { Tourpackage, TourpackageDto } from './tourpackage.model';
import { Repository } from 'typeorm';
export declare class TourpackageService {
    private readonly tourPacageRepository;
    constructor(tourPacageRepository: Repository<Tourpackage>);
    create(tourPackageDto: TourpackageDto, path: string): Promise<Tourpackage>;
    findOne(title: string): Promise<Tourpackage>;
    findByFlight(category: string): Promise<Tourpackage[]>;
    findAll(): Promise<Tourpackage[]>;
}
