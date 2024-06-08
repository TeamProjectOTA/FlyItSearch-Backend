interface AgentData {
    name: string;
    age: number;
}
interface PriceCheckResult {
    IsBookable: boolean;
}
export declare class BookingService {
    constructor();
    createBooking(agentdata: AgentData[], path: string, bookingDto: any, priceCheckResult: PriceCheckResult): Promise<any>;
}
export {};
