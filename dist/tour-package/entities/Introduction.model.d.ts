import { TourPackage } from './tourPackage.model';
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
    tourPackage: TourPackage;
}
