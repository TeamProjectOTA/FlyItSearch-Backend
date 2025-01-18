declare class CreateTourPlanDto {
    title: string;
    plan: string;
}
declare class CreateIntroductionDto {
    mainTitle: string;
    subTitle: string;
    tripType: string;
    journeyDuration: string;
    journeyStartDate: string;
    journeyEndDate: string;
    journeyLocation: string[];
    totalSeat: string;
    minimumAge: string;
    maximumAge: string;
    packagePrice: string;
    packageDiscount?: string;
}
export declare class CreateTourPackageDto {
    status: string;
    packageType: string;
    overView: {
        packageOverView: string;
        packageInclude: string[];
    };
    tourPlan: any;
    objective: {
        inclusion: any;
        exclusion: any;
        bookingPolicy: any;
        refundPolicy: any;
    };
    metaInfo: {
        metaTitle: string;
        metaKeyword: string[];
        metadescription: string;
    };
    introduction: CreateIntroductionDto;
    tourPlans: CreateTourPlanDto[];
}
export {};
