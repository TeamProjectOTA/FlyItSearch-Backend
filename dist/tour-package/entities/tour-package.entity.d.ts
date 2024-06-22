import { TravelPackageInclusionDto, TripType } from '../dto/types';
export declare class Introduction {
    id: number;
    mainTitle: string;
    subTitle: string;
    journeyDuration: string;
    startDate: string;
    endDate: string;
    countryName: string;
    cityName: string;
    journeyLocation: string;
    totalSeat: string;
    maximumAge: number;
    minimumAge: number;
    packagePrice: number;
    packageDiscount: number;
    packageOverview: string;
}
export declare class Overview {
    id: number;
    packageOverview: string;
    packageInclude: TravelPackageInclusionDto[];
}
export declare class MainImage {
    id: number;
    path: string;
    size: number;
    description: string;
    mainTitle: string;
}
export declare class VisitPlace {
    id: number;
    path: string;
    size: number;
    placeName: string;
    description: string;
    mainTitle: string;
}
export declare class TourPlan {
    id: number;
    tourPlanTitle: string;
    dayPlan: string;
}
export declare class Objectives {
    id: number;
    objective: string;
}
export declare class MetaInfo {
    id: number;
    metaTitle: string;
    metaKeywords: TripType[];
    metaDescription: string;
}
export declare class TourPackage {
    id: number;
    introduction: Introduction;
    overview: Overview;
    mainImage: MainImage[];
    visitPlace: VisitPlace[];
    tourPlan: TourPlan[];
    objectives: Objectives[];
    metaInfo: MetaInfo;
}
