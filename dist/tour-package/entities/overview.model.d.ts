import { TourPackage } from './tour-package.entity';
import { TravelPackageInclusionDto } from '../dto/types';
export declare class Overview {
    id: number;
    packageOverview: string;
    packageInclude: TravelPackageInclusionDto[];
    tourPackage: TourPackage;
}
