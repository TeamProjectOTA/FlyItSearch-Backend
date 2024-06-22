import { TravelPackageInclusionDto, TripType } from './types';
export declare class CreateIntroductionDto {
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
export declare class CreateOverviewDto {
    packageOverview: string;
    packageInclude: TravelPackageInclusionDto[];
}
export declare class CreateMainImageDto {
    path: string;
    size: number;
    description: string;
    mainTitle: string;
}
export declare class CreateVisitPlaceDto {
    path: string;
    size: number;
    placeName: string;
    description: string;
    mainTitle: string;
}
export declare class CreateTourPlanDto {
    tourPlanTitle: string;
    dayPlan: string;
}
export declare class CreateObjectivesDto {
    objective: string;
}
export declare class CreateMetaInfoDto {
    metaTitle: string;
    metaKeywords: TripType[];
    metaDescription: string;
}
export declare class CreateTourPackageDto {
    introduction: CreateIntroductionDto;
    overview: CreateOverviewDto;
    mainImage: CreateMainImageDto[];
    visitPlace: CreateVisitPlaceDto[];
    tourPlan: CreateTourPlanDto[];
    objectives: CreateObjectivesDto[];
    metaInfo: CreateMetaInfoDto;
}
