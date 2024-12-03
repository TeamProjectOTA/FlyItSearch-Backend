import { FlightSearchModel } from '../flight.model';
import { searchResultDtobdf } from './Dto/bdfare.model';
import { BfFareUtil } from './bdfare.util';
import { BookingID } from 'src/book/booking.model';
import { MailService } from 'src/mail/mail.service';
export declare class BDFareService {
    private readonly bdfareUtil;
    private readonly mailService;
    private readonly apiUrl;
    private readonly apiKey;
    constructor(bdfareUtil: BfFareUtil, mailService: MailService);
    private transformToRequestDto;
    private mapCabinClass;
    airShopping(flightSearchModel: FlightSearchModel): Promise<any>;
    fareRules(data: searchResultDtobdf): Promise<any>;
    offerPrice(data: searchResultDtobdf): Promise<any>;
    miniRule(data: searchResultDtobdf): Promise<any>;
    flightBooking(): Promise<void>;
    flightRetrieve(BookingID: BookingID): Promise<any>;
    flightBookingCancel(BookingID: BookingID): Promise<any>;
    flightBookingChange(): Promise<void>;
    private determineJourneyType;
}
