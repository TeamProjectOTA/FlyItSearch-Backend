import { FlightSearchModel } from '../flight.model';
import { searchResultDtobdf } from './Dto/bdfare.model';
import { BfFareUtil } from './bdfare.util';
export declare class BDFareService {
    private readonly bdfareUtil;
    private readonly apiUrl;
    private readonly apiKey;
    constructor(bdfareUtil: BfFareUtil);
    private transformToRequestDto;
    private mapCabinClass;
    airShopping(flightSearchModel: FlightSearchModel): Promise<any>;
    fareRules(data: searchResultDtobdf): Promise<any>;
    offerPrice(data: searchResultDtobdf): Promise<any>;
    miniRule(): Promise<void>;
    flightBooking(): Promise<void>;
    flightRetrieve(): Promise<void>;
    flightBookingChange(): Promise<void>;
    flightBookingCancel(): Promise<void>;
    private determineJourneyType;
}
