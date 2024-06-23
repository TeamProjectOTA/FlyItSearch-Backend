import { TourPackage } from "./tour-package.entity";
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
    tourPackage: TourPackage;
}
