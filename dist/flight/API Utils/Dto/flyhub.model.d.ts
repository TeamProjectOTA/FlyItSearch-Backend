export declare class FlyAirSearchDto {
    AdultQuantity: number;
    ChildQuantity: number;
    InfantQuantity: number;
    EndUserIp: string;
    JourneyType: string;
    Segments: {
        Origin: string;
        Destination: string;
        CabinClass: string;
        DepartureDateTime: string;
    }[];
}
export declare class searchResultDto {
    SearchId: string;
    ResultId: string;
}
export declare class BaggageDto {
    BaggageID: string;
}
export declare class MealDto {
    MealID: string;
}
export declare class PassengerDto {
    Title: string;
    FirstName: string;
    LastName: string;
    PaxType: string;
    DateOfBirth: Date;
    Gender: string;
    PassportNumber?: string;
    PassportExpiryDate?: Date;
    PassportNationality?: string;
    Address1: string;
    Address2?: string;
    CountryCode: string;
    Nationality: string;
    ContactNumber: string;
    Email: string;
    IsLeadPassenger: boolean;
    FFAirline?: string;
    FFNumber?: string;
    Baggage?: BaggageDto[];
    Meal?: MealDto[];
    passport?: any;
    visa?: any;
}
export declare class FlbFlightSearchDto {
    SearchID: string;
    ResultID: string;
    Passengers: PassengerDto[];
    PromotionCode?: string;
}
