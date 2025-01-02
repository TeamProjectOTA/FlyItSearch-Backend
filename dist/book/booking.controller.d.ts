import { BookingService } from './booking.service';
import { BookingDataDto, BookingID } from './booking.model';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { BDFareService } from 'src/flight/API Utils/bdfare.flights.service';
import { Request } from 'express';
export declare class BookingController {
    private readonly bookingService;
    private readonly flyHubService;
    private readonly bdfareService;
    constructor(bookingService: BookingService, flyHubService: FlyHubService, bdfareService: BDFareService);
    airbook(data: FlbFlightSearchDto, header: Headers, request: Request): Promise<any>;
    aircanel(bookingIdDto: BookingID, header: Headers): Promise<any>;
    airRetrive(bookingIdDto: BookingID, header: Headers, request: Request): Promise<any>;
    bdfCancel(bookingIdDto: BookingID): Promise<any>;
    airRetriveBDF(bookingIdDto: BookingID, request: Request, header: Headers): Promise<any>;
    airRetriveAdmin(bookingIdDto: BookingID): Promise<any>;
    findAll(bookingStatus?: string, page?: number, limit?: number): Promise<{
        data: import("./booking.model").BookingSave[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    findUserWithBookings(header: Headers, bookingStatus: string): Promise<any>;
    ticketMake(bookingIdDto: BookingID): Promise<any>;
    bdfareBook(bookingdto: BookingDataDto, header: Headers, request: Request): Promise<any>;
}
