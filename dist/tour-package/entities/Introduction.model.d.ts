import { TourPackage } from './tourPackage.model';
export declare class Introduction {
    id: number;
    mainTitle: string;
    subTitle: string;
    tripType: string;
    journeyDuration: string;
    journeyStartDate: string;
    journeyEndDate: string;
    journeyLocation: any;
    totalSeat: string;
    minimumAge: string;
    maximumAge: string;
    packagePrice: string;
    withAirFare: boolean;
    withHotel: boolean;
    packageDiscountType?: string;
    packageDiscountAmount?: string;
    tourPackage: TourPackage;
}
