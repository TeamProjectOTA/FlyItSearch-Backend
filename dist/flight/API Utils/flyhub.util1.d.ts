import { AirlinesService } from "src/airlines/airlines.service";
import { AirportsService } from "src/airports/airports.service";
export declare class flyhubUtil {
    private readonly airlinesService;
    private readonly airportsService;
    constructor(airlinesService: AirlinesService, airportsService: AirportsService);
    restBFMParser(SearchResponse: any): Promise<any[]>;
    getAirports(code: string): Promise<{
        code: string;
        name: string;
        location: string;
    } | {
        code: string;
        name: string;
        location: Location;
    }>;
    getAirlineName(code: string): Promise<string>;
}
