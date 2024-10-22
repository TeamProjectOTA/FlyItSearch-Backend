import { FlyHubUtil } from './flyhub.util';
import { FlbFlightSearchDto, FlyAirSearchDto, searchResultDto } from './Dto/flyhub.model';
import { BookingIdSave, FlightSearchModel } from '../flight.model';
import { Repository } from 'typeorm';
import { BookingID, BookingSave } from 'src/book/booking.model';
export declare class FlyHubService {
    private readonly flyHubUtil;
    private readonly bookingIdSave;
    private readonly bookingSaveRepository;
    private readonly username;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(flyHubUtil: FlyHubUtil, bookingIdSave: Repository<BookingIdSave>, bookingSaveRepository: Repository<BookingSave>);
    getToken(): Promise<string>;
    searchFlights(reqBody: FlyAirSearchDto): Promise<any>;
    aircancel(BookingID: BookingID, header: any): Promise<any>;
    airRetrive(BookingID: BookingID, header?: any): Promise<any>;
    bookingRules(data: searchResultDto): Promise<any>;
    airPrice(data: searchResultDto): Promise<any[]>;
    airRules(data: searchResultDto): Promise<any>;
    airbook(data: FlbFlightSearchDto, header: any, currentTimestamp: any, personIds: any): Promise<any>;
    airRetriveAdmin(BookingID: BookingID): Promise<any>;
    convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel, userIp: string): Promise<any>;
    private determineJourneyType;
}
