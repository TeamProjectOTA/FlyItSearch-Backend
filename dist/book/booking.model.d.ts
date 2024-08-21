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
    laginfo: any;
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
export {};
