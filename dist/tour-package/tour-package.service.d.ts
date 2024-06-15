import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';
import { TourPackage } from './entities/tour-package.entity';
import { Repository } from 'typeorm';
export declare class TourPackageService {
    private readonly tourPackageRepository;
    constructor(tourPackageRepository: Repository<TourPackage>);
    create(createTourPackageDto: CreateTourPackageDto): Promise<TourPackage>;
    private getDayOfWeek;
    private formatDate;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTourPackageDto: UpdateTourPackageDto): string;
    remove(id: number): string;
}
