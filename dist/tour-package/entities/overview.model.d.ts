import { TravelPackageInclusionDto } from "../dto/types";
import { TourPackage } from "./tour-package.entity";
export declare class Overview {
    id: number;
    packageOverview: string;
    packageInclude: TravelPackageInclusionDto[];
    tourPackage: TourPackage;
}
