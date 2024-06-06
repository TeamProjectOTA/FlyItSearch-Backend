import { FlightService } from './flight.service';
import { Flight, flightModel } from './flight.model';
export declare class FlightController {
    private readonly flightService;
    constructor(flightService: FlightService);
    filterFlights(filter: flightModel): Promise<Flight[]>;
}
