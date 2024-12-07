import { BookingIdSave, FlightSearchModel } from '../flight.model';
import { searchResultDtobdf } from './Dto/bdfare.model';
import { BfFareUtil } from './bdfare.util';
import { BookingDataDto, BookingID, BookingSave } from 'src/book/booking.model';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
export declare class BDFareService {
    private readonly bookingIdSave;
    private readonly bookingSaveRepository;
    private readonly bdfareUtil;
    private readonly mailService;
    private readonly apiUrl;
    private readonly apiKey;
    constructor(bookingIdSave: Repository<BookingIdSave>, bookingSaveRepository: Repository<BookingSave>, bdfareUtil: BfFareUtil, mailService: MailService);
    private transformToRequestDto;
    private mapCabinClass;
    airShopping(flightSearchModel: FlightSearchModel): Promise<any>;
    fareRules(data: searchResultDtobdf): Promise<any>;
    offerPrice(data: searchResultDtobdf): Promise<any>;
    miniRule(data: searchResultDtobdf): Promise<any>;
    flightBooking(bookingdata: BookingDataDto, header: any, currentTimestamp: any, personIds: any): Promise<any>;
    flightRetrieve(BookingID: BookingID): Promise<any>;
    flightBookingCancel(BookingID: BookingID): Promise<any>;
    flightBookingChange(): Promise<void>;
    private bookingDataModification;
    private determineJourneyType;
}
