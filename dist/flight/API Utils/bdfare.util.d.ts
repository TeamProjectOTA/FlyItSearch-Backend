import { AirportsService } from 'src/airports/airports.service';
export declare class BfFareUtil {
    private readonly airportService;
    constructor(airportService: AirportsService);
    afterSerarchDataModifierBdFare(SearchResponse: any, journeyType?: string): Promise<any[]>;
}
