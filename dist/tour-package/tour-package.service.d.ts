import { TourPackage } from './entities/tourPackage.model';
import { CreateTourPackageDto } from './dto/tourPackage.dto';
import { Repository } from 'typeorm/repository/Repository';
export declare class TourPackageService {
    private readonly tourPackageRepository;
    constructor(tourPackageRepository: Repository<TourPackage>);
    create(createTourPackageDto: CreateTourPackageDto): Promise<TourPackage>;
}
