import { TourPackage } from './tour-package.entity';
export declare class Introduction {
    id: number;
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
    tourPackage: TourPackage;
}
