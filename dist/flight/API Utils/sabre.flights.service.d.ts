import { SabreUtils } from './sabre.utils';
import { FlightSearchModel } from '../flight.model';
import { FareRulesDto } from '../dto/fare-rules.flight.dto';
import { BookingServicesbr } from '../booking.service';
interface AgentData {
    name: string;
    age: number;
}
interface FlightInfo {
}
interface PriceCheckResult {
    IsBookable: boolean;
}
export declare class SabreService {
    private readonly bookingService;
    private readonly sabreUtils;
    constructor(bookingService: BookingServicesbr, sabreUtils: SabreUtils);
    restToken(): Promise<string>;
    sabreCreateSessionSoap(): Promise<any>;
    sabreSessionLessTokenSoap(): Promise<any>;
    closeSession(): Promise<any>;
    shoppingBranded(flightDto: FlightSearchModel): Promise<any>;
    revalidation(revalidationDto: any): Promise<any>;
    price_check(agentdata: AgentData[], flightInfo: FlightInfo): Promise<PriceCheckResult[]>;
    booking(bookingDto: any): Promise<any>;
    aircancel(pnr: string): Promise<any>;
    airretrieve(pnr: string): Promise<any>;
    checkpnr(pnr: string): Promise<any>;
    airticketing(BookingData: any): Promise<any>;
    airvoid(pnr: string): Promise<any>;
    airfarerules(farerulesDto: FareRulesDto): Promise<any>;
    get_ticket(pnr: string): Promise<any>;
    seat_map(seatMapDto: any): Promise<void>;
}
export {};
