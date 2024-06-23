import { TripType } from "../dto/types";
import { TourPackage } from "./tour-package.entity";
export declare class MetaInfo {
    id: number;
    metaTitle: string;
    metaKeywords: TripType[];
    metaDescription: string;
    tourPackage: TourPackage;
}
