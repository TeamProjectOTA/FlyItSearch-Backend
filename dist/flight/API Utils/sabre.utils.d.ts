import { Agents } from 'src/agents/entities/agents.entity';
import { AirportsService } from 'src/airports/airports.service';
import { AirlinesService } from 'src/airlines/airlines.service';
export declare class SabreUtils {
    private readonly airlinesService;
    private readonly airportsService;
    constructor(airlinesService: AirlinesService, airportsService: AirportsService);
    tokenParser(data: any): Promise<any>;
    xmlParser(data: any): Promise<any>;
    restBFMParser(agentdata: Agents, SearchResponse: any): Promise<any[]>;
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
    fareRulesParser(data: any): Promise<{}>;
    seatMapParser(data: any): Promise<void>;
}
