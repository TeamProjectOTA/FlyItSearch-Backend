import { FlightSearchModel } from './flight.model';
import { HttpService } from '@nestjs/axios';
import { RequestDto } from './bdfare.model';
export declare class BDFareService {
    private readonly httpService;
    private readonly apiUrl;
    private readonly apiKey;
    constructor(httpService: HttpService);
    private transformToRequestDto;
    private mapCabinClass;
    processApi2(flightSearchModel: FlightSearchModel): Promise<any>;
    airShopping(flightDto: FlightSearchModel): Promise<void>;
    fareRules(): Promise<void>;
    offerPrice(): Promise<void>;
    miniRule(): Promise<void>;
    flightBooking(): Promise<void>;
    flightRetrieve(): Promise<void>;
    flightBookingChange(): Promise<void>;
    flightBookingCancel(): Promise<void>;
    processApi(bdfaredto: RequestDto): Promise<any>;
}
