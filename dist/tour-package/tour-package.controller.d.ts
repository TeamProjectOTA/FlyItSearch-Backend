import { TourPackageService } from './tour-package.service';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';
export declare class TourPackageController {
    private readonly tourPackageService;
    constructor(tourPackageService: TourPackageService);
    create(createTourPackageDto: CreateTourPackageDto): Promise<import("./entities/tour-package.entity").TourPackage>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTourPackageDto: UpdateTourPackageDto): string;
    remove(id: string): string;
}
