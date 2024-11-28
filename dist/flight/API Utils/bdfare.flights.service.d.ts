import { FlightSearchModel } from '../flight.model';
import { BfFareUtil } from './bdfare.util';
export declare class BDFareService {
    private readonly bdfareUtil;
    private readonly apiUrl;
    private readonly apiKey;
    constructor(bdfareUtil: BfFareUtil);
    private transformToRequestDto;
    private mapCabinClass;
    airShopping(flightSearchModel: FlightSearchModel): Promise<any>;
    fareRules(): Promise<void>;
    offerPrice(): Promise<void>;
    miniRule(): Promise<void>;
    flightBooking(): Promise<void>;
    flightRetrieve(): Promise<void>;
    flightBookingChange(): Promise<void>;
    flightBookingCancel(): Promise<void>;
    private determineJourneyType;
}
