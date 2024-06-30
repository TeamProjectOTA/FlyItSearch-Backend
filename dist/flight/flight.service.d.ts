import { FlyAirSearchDto } from './API Utils/Dto/flyhub.model';
import { FlightSearchModel } from './flight.model';
export declare class FlightService {
    convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel): Promise<FlyAirSearchDto>;
    private determineJourneyType;
}
