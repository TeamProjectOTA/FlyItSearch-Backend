import { TourPackage } from './entities/tourPackage.model';
import { CreateTourPackageDto } from './dto/tourPackage.dto';
import { Repository } from 'typeorm/repository/Repository';
import { Introduction } from './entities/Introduction.model';
import { TourPlan } from './entities/tourPlan.Model';
export declare class TourPackageService {
    private readonly tourPackageRepository;
    private readonly introductionRepository;
    private readonly tourPlanRepository;
    constructor(tourPackageRepository: Repository<TourPackage>, introductionRepository: Repository<Introduction>, tourPlanRepository: Repository<TourPlan>);
    create(createTourPackageDto: CreateTourPackageDto): Promise<TourPackage>;
    findAll(): Promise<any>;
}
