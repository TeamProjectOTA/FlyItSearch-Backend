import { AirlinesService } from "src/airlines/airlines.service";
import { AirportsService } from "src/airports/airports.service";
export declare class FlyHubUtil {
    private readonly airlinesService;
    private readonly airportsService;
    constructor(airlinesService: AirlinesService, airportsService: AirportsService);
    restBFMParser(SearchResponses: any[]): Promise<any[]>;
}
