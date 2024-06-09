import { FlightService } from './flight.service';
import { FlightSearchModel } from './flight.model';
import { SabreService } from './sabre.flights.service';
import { FareRulesDto } from './dto/fare-rules.flight.dto';
export declare class FlightController {
    private readonly flightService;
    private readonly sabreService;
    constructor(flightService: FlightService, sabreService: SabreService);
    search(flightdto: FlightSearchModel): Promise<any>;
    getpnr(pnr: string): Promise<any>;
    airvoid(pnr: string): Promise<any>;
    get_ticket(pnr: string): Promise<any>;
    airfarerules(fareRulesDto: FareRulesDto): Promise<any>;
    airretrieve(pnr: string): Promise<any>;
}
