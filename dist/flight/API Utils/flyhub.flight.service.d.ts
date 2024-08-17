import { FlyHubUtil } from './flyhub.util';
import { FlbFlightSearchDto, FlyAirSearchDto, searchResultDto } from './Dto/flyhub.model';
import { FlightSearchModel } from '../flight.model';
import { BookingID } from 'src/book/booking.model';
export declare class FlyHubService {
    private readonly flyHubUtil;
    private readonly username;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(flyHubUtil: FlyHubUtil);
    getToken(): Promise<string>;
    searchFlights(reqBody: FlyAirSearchDto): Promise<any>;
    aircancel(BookingID: BookingID, header?: any): Promise<any>;
    airRetrive(BookingID: BookingID): Promise<any>;
    bookingRules(data: searchResultDto): Promise<any>;
    airPrice(data: searchResultDto): Promise<any[]>;
    airRules(data: searchResultDto): Promise<any>;
    airbook(data: FlbFlightSearchDto, header?: any, currentTimestamp?: Date): Promise<{
        updatedData: any[];
        rawData: any;
    }>;
    convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel, userIp: string): Promise<any>;
    private determineJourneyType;
}
