import { FlyHubUtil } from './flyhub.util';
import { FlyAirSearchDto } from './Dto/flyhub.model';
import { FlightSearchModel } from '../flight.model';
export declare class FlyHubService {
    private readonly flyHubUtil;
    private request;
    private readonly username;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(flyHubUtil: FlyHubUtil, request: Request);
    getToken(): Promise<string>;
    convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel): Promise<FlyAirSearchDto>;
    searchFlights(data: any): Promise<any>;
}
