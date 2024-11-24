import { BookingService } from './booking.service';
import { BookingID } from './booking.model';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
export declare class BookingController {
    private readonly bookingService;
    private readonly flyHubService;
    constructor(bookingService: BookingService, flyHubService: FlyHubService);
    airbook(data: FlbFlightSearchDto, header: Headers): Promise<any>;
    aircanel(bookingIdDto: BookingID, header: Headers): Promise<any>;
    airRetrive(bookingIdDto: BookingID, header: Headers): Promise<any>;
    airRetriveAdmin(bookingIdDto: BookingID): Promise<any>;
    findAll(bookingStatus?: string, page?: number, limit?: number): Promise<{
        data: import("./booking.model").BookingSave[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    findUserWithBookings(header: Headers, bookingStatus: string): Promise<any>;
    ticletMake(bookingIdDto: BookingID): Promise<any>;
}
