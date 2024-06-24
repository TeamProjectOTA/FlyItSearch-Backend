import { BookingPolicy, Exclusion, Inclusion, RefundPolicy, TravelPackageInclusionDto, TripType } from './types';
export declare class CreateIntroductionDto {
    mainTitle: string;
    subTitle: string;
    tripType: string;
    journeyDuration: string;
    startDate: string;
    endDate: string;
    countryName: string;
    cityName: string;
    journeyLocation: string;
    totalSeat: number;
    maximumAge: number;
    minimumAge: number;
    packagePrice: number;
    packageDiscount: number;
}
export declare class CreateOverviewDto {
    packageOverview: string;
    packageInclude: TravelPackageInclusionDto[];
}
export declare class CreateMainImageDto {
    path: string;
    size: number;
    mainTitle: string;
}
export declare class CreateVisitPlaceDto {
    path: string;
    size: number;
    pictureName: string;
}
export declare class CreateTourPlanDto {
    tourPlanTitle: string;
    dayPlan: string;
}
export declare class CreateObjectivesDto {
    inclusion: Inclusion[];
    exclusion: Exclusion[];
    bookingPolicy: BookingPolicy[];
    refundPolicy: RefundPolicy[];
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
