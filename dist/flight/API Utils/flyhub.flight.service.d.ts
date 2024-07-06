import { FlyHubUtil } from './flyhub.util';
import { FlyAirSearchDto } from './Dto/flyhub.model';
import { FlightSearchModel } from '../flight.model';
import { BookingID } from '../dto/fare-rules.flight.dto';
export declare class FlyHubService {
    private readonly flyHubUtil;
    private request;
    private readonly username;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(flyHubUtil: FlyHubUtil, request: Request);
    getToken(): Promise<string>;
    convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel): Promise<any>;
    searchFlights(data: FlyAirSearchDto): Promise<any>;
    private determineJourneyType;
    airRetrive(BookingID: BookingID): Promise<any>;
    aircancel(BookingID: BookingID): Promise<any>;
    airbook(): Promise<string>;
}
