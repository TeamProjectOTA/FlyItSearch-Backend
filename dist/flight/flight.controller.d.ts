import { FlightService } from './flight.service';
import { FlightSearchModel } from './flight.model';
import { SabreService } from './sabre.flights.service';
export declare class FlightController {
    private readonly flightService;
    private readonly sabreService;
    constructor(flightService: FlightService, sabreService: SabreService);
    search(flightdto: FlightSearchModel): Promise<any>;
}
