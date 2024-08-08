import { User } from 'src/user/entities/user.entity';
export declare class SaveBooking {
    id: number;
    system: string;
    bookingId: string;
    paxCount: number;
    Curriername: string;
    CurrierCode: string;
    flightNumber: string;
    isRefundable: boolean;
    bookingDate: Date;
    expireDate: Date;
    bookingStatus: string;
    TripType: string;
    laginfo: LagInfo[];
    user: User;
}
export declare class LagInfo {
    id: number;
    DepDate: string;
    DepFrom: string;
    ArrTo: string;
    saveBooking: SaveBooking;
}
export declare class BookingID {
    BookingID: string;
}
declare class CreateLagInfoDto {
    DepDate: string;
    DepFrom: string;
    ArrTo: string;
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
    expireDate: string;
    bookingStatus: string;
    TripType: string;
    laginfo: CreateLagInfoDto[];
}
export {};
