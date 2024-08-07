import { BookService } from './book.service';
import { BookingID, CreateSaveBookingDto } from './book.model';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { FlyHubUtil } from 'src/flight/API Utils/flyhub.util';
export declare class BookController {
    private readonly bookingService;
    private readonly flyHubService;
    private readonly flyHubUtil;
    constructor(bookingService: BookService, flyHubService: FlyHubService, flyHubUtil: FlyHubUtil);
    airbook(data: FlbFlightSearchDto, uuid: string, header: Headers): Promise<any[]>;
    aircanel(bookingIdDto: BookingID, uuid: string, header: Headers): Promise<any>;
    airRetrive(bookingIdDto: BookingID): Promise<any>;
    bookingtest(data: any, header: any): Promise<any>;
    test(data: any): Promise<any>;
    SaveBooking(createSaveBookingDto: CreateSaveBookingDto, header: Headers): Promise<import("./book.model").SaveBooking>;
}
