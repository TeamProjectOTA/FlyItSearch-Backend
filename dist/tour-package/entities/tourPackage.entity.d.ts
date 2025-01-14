export declare class TourPackage {
    id: number;
    packageId: string;
    status: string;
    packageType: string;
    overView: {
        packageOverView: string;
        packageInclude: string[];
    };
    mainImage: string[];
    visitPlace: string[];
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
}
export declare class Introduction {
    id: number;
    mainTitle: string;
    subTitle: string;
    tripType: string;
    journeyDuration: string;
    journeyStartDate: string;
    journeyEndDate: string;
    countryName: string;
    cityName: string;
    journeyLocation: string;
    totalSeat: string;
    minimumAge: string;
    maximumAge: string;
    packagePrice: string;
    packageDiscount?: string;
}
export declare class TourPlan {
    id: number;
    title: string;
    plan: string;
}
