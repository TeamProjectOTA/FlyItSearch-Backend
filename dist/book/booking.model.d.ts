import { User } from 'src/user/entities/user.entity';
export declare class BookingSave {
    id: number;
    system: string;
    bookingId: string;
    paxCount: number;
    Curriername: string;
    CurrierCode: string;
    flightNumber: string;
    isRefundable: boolean;
    bookingDate: string;
    expireDate: Date;
    bookingStatus: string;
    TripType: string;
    PNR: string;
    grossAmmount: string;
    netAmmount: string;
    actionAt: string;
    actionBy: String;
    reason: string;
    laginfo: any;
    personId: {
        index?: number;
        visa?: string;
        passport?: string;
    }[];
    bookingData: any;
    user: User;
}
declare class CreateLagInfoDto {
    DepDate?: string;
    DepFrom?: string;
    ArrTo?: string;
}
export declare class CreateSaveBookingDto {
    system: string;
    bookingId: string;
    paxCount: number;
    Curriername: string;
    CurrierCode: string;
    flightNumber: string;
    isRefundable: boolean;
    bookingDate: string;
    expireDate: Date;
    bookingStatus: string;
    TripType: string;
    laginfo: CreateLagInfoDto[];
}
export declare class BookingID {
    BookingID: string;
}
export declare class PassengerDto {
    Title: string;
    FirstName: string;
    LastName: string;
    PaxType: string;
    DateOfBirth: string;
    Gender: string;
    PassportNumber?: string;
    PassportExpiryDate?: string;
    PassportNationality?: string;
    passport?: string;
    visa?: string;
    CountryCode: string;
    Nationality: string;
    FFAirline?: string;
    FFNumber?: string;
    SSRType?: string;
    SSRRemarks?: string;
    ContactNumber: string;
    Email: string;
    Address1?: string;
    IsLeadPassenger: boolean;
}
export declare class BookingDataDto {
    SearchId: string;
    ResultId: string[];
    Passengers: PassengerDto[];
}
export {};
