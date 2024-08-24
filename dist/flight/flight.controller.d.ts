import { FlightSearchModel } from './flight.model';
import { Request } from 'express';
import { FareRulesDto } from './dto/fare-rules.flight.dto';
import { SabreService } from './API Utils/sabre.flights.service';
import { BDFareService } from './API Utils/bdfare.flights.service';
import { RequestDto } from './API Utils/Dto/bdfare.model';
import { searchResultDto } from './API Utils/Dto/flyhub.model';
import { FlyHubService } from './API Utils/flyhub.flight.service';
import { FlyHubUtil } from './API Utils/flyhub.util';
export declare class FlightController {
    private readonly sabreService;
    private readonly bdFareService;
    private readonly flyHubService;
    private readonly testservice;
    constructor(sabreService: SabreService, bdFareService: BDFareService, flyHubService: FlyHubService, testservice: FlyHubUtil);
    getApiResponse(bdfaredto: RequestDto): Promise<any>;
    searchFlights(flightSearchModel: FlightSearchModel): Promise<any>;
    getpnr(pnr: string): Promise<any>;
    airvoid(pnr: string): Promise<any>;
    get_ticket(pnr: string): Promise<any>;
    airfarerules(fareRulesDto: FareRulesDto): Promise<any>;
    airretrieve(pnr: string): Promise<any>;
    convertToFlyAirSearchDto(flightSearchModel: FlightSearchModel, request: Request): Promise<any>;
    airPrice(data: searchResultDto): Promise<any[]>;
    miniRules(data: searchResultDto): Promise<any>;
    airRules(data: searchResultDto): Promise<any>;
    apicheck(SearchResponse: any, header: Headers, fisId: string): Promise<any>;
}
