import { FlightService } from './flight.service';
import { FlightSearchModel } from './flight.model';
import { FareRulesDto } from './dto/fare-rules.flight.dto';
import { SabreService } from './API Utils/sabre.flights.service';
import { BDFareService } from './API Utils/bdfare.flights.service';
import { RequestDto } from './API Utils/Dto/bdfare.model';
import { FlyAirSearchDto } from './API Utils/Dto/flyhub.model';
import { FlyHubService } from './API Utils/flyhub.flight.service';
export declare class FlightController {
    private readonly flightService;
    private readonly sabreService;
    private readonly bdFareService;
    private readonly flyHubService;
    constructor(flightService: FlightService, sabreService: SabreService, bdFareService: BDFareService, flyHubService: FlyHubService);
    searchFlightsFlyhub(airSearchDto: FlyAirSearchDto): Promise<any>;
    convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel): Promise<any>;
    auth(): Promise<string>;
    getApiResponse(bdfaredto: RequestDto): Promise<any>;
    searchFlights(flightSearchModel: FlightSearchModel): Promise<any>;
    search(flightdto: FlightSearchModel): {
        BdFare: Promise<any>;
    };
    getpnr(pnr: string): Promise<any>;
    airvoid(pnr: string): Promise<any>;
    get_ticket(pnr: string): Promise<any>;
    airfarerules(fareRulesDto: FareRulesDto): Promise<any>;
    airretrieve(pnr: string): Promise<any>;
}
