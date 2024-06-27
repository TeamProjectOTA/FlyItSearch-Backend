import { FlightService } from './flight.service';
import { FlightSearchModel } from './flight.model';
import { SabreService } from './sabre.flights.service';
import { FareRulesDto } from './dto/fare-rules.flight.dto';
import { BDFareService } from './bdfare.flights.service';
import { RequestDto } from './bdfare.model';
export declare class FlightController {
    private readonly flightService;
    private readonly sabreService;
    private readonly bdFareService;
    constructor(flightService: FlightService, sabreService: SabreService, bdFareService: BDFareService);
    getApiResponse(bdfaredto: RequestDto): Promise<any>;
    searchFlights(flightSearchModel: FlightSearchModel): Promise<any>;
    search(flightdto: FlightSearchModel): {
        BdFare: Promise<void>;
    };
    getpnr(pnr: string): Promise<any>;
    airvoid(pnr: string): Promise<any>;
    get_ticket(pnr: string): Promise<any>;
    airfarerules(fareRulesDto: FareRulesDto): Promise<any>;
    airretrieve(pnr: string): Promise<any>;
}
