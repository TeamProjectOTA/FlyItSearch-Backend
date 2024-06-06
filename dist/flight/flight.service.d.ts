import { Repository } from 'typeorm';
import { Flight, flightModel } from './flight.model';
export declare class FlightService {
    private readonly flightRepository;
    constructor(flightRepository: Repository<Flight>);
    filterFlights(filter: flightModel): Promise<Flight[]>;
}
