import { FlyHubUtil } from './flyhub.util';
import { FlyAirSearchDto, searchResultDto } from './Dto/flyhub.model';
import { FlightSearchModel } from '../flight.model';
import { BookingID } from '../dto/fare-rules.flight.dto';
import { Test } from './test.service';
export declare class FlyHubService {
    private readonly flyHubUtil;
    private readonly testutil;
    private readonly username;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(flyHubUtil: FlyHubUtil, testutil: Test);
    getToken(): Promise<string>;
    searchFlights(reqBody: FlyAirSearchDto): Promise<any>;
    aircancel(BookingID: BookingID): Promise<any>;
    airRetrive(BookingID: BookingID): Promise<any>;
    bookingRules(data: searchResultDto): Promise<any>;
    airPrice(data: searchResultDto): Promise<any>;
    convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel): Promise<any>;
    private determineJourneyType;
    airbook(data: searchResultDto): Promise<void>;
}
