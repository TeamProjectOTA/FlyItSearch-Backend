export declare enum TripType {
    tp1 = "Family Tour",
    tp2 = "Group Tour",
    tp3 = "Relax"
}
export declare class CreateTourPackageDto {
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
