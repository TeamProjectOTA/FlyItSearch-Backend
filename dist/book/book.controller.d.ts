import { BookService } from './book.service';
import { BookingID } from './book.model';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { FlyHubUtil } from 'src/flight/API Utils/flyhub.util';
export declare class BookController {
    private readonly fileupload;
    private readonly flyHubService;
    private readonly flyHubUtil;
    constructor(fileupload: BookService, flyHubService: FlyHubService, flyHubUtil: FlyHubUtil);
    airbook(data: FlbFlightSearchDto): Promise<any[]>;
    aircanel(bookingIdDto: BookingID): Promise<any>;
    airRetrive(bookingIdDto: BookingID): Promise<any>;
    bookingtest(data: any): Promise<any>;
}
