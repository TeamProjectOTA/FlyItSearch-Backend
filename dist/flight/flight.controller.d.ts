import { FlightService } from './flight.service';
import { FlightSearchModel } from './flight.model';
import { BookingID, FareRulesDto } from './dto/fare-rules.flight.dto';
import { SabreService } from './API Utils/sabre.flights.service';
import { BDFareService } from './API Utils/bdfare.flights.service';
import { RequestDto } from './API Utils/Dto/bdfare.model';
import { FlyHubService } from './API Utils/flyhub.flight.service';
export declare class FlightController {
    private readonly flightService;
    private readonly sabreService;
    private readonly bdFareService;
    private readonly flyHubService;
    constructor(flightService: FlightService, sabreService: SabreService, bdFareService: BDFareService, flyHubService: FlyHubService);
    convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel): Promise<any>;
    airRetrive(bookingIdDto: BookingID): Promise<any>;
    aircancel(): Promise<string>;
    aircanel(bookingIdDto: BookingID): Promise<any>;
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
