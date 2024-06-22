import { Repository } from 'typeorm';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { TourPackage } from './entities/tour-package.entity';
export declare class TourPackageService {
    private tourPackageRepository;
    constructor(tourPackageRepository: Repository<TourPackage>);
    create(createTourPackageDto: CreateTourPackageDto): Promise<TourPackage>;
    findAll(): Promise<TourPackage[]>;
}
