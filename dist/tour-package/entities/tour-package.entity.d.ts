import { TripType } from '../dto/create-tour-package.dto';
export declare class TourPackage {
    id: number;
    mainTitle: string;
    subTitle: string;
    tripType: TripType[];
    journeyDuration: string;
    startDate: string;
    endDate: string;
    countryName: string;
    cityName: string;
    journeyLocation: string;
    totalSeat: string;
    maximunAge: number;
    minimumAge: number;
    packagePrice: number;
    packageDiscount: number;
    packageOverview: string;
}
