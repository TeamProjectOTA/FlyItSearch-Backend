import { HttpService } from '@nestjs/axios';
import { FlightSearchModel } from '../flight.model';
import { RequestDto } from './Dto/bdfare.model';
export declare class BDFareService {
    private readonly httpService;
    private readonly apiUrl;
    private readonly apiKey;
    constructor(httpService: HttpService);
    private transformToRequestDto;
    private mapCabinClass;
    airShopping(flightSearchModel: FlightSearchModel): Promise<any>;
    airShopping1(flightDto: FlightSearchModel): Promise<void>;
    fareRules(): Promise<void>;
    offerPrice(): Promise<void>;
    miniRule(): Promise<void>;
    flightBooking(): Promise<void>;
    flightRetrieve(): Promise<void>;
    flightBookingChange(): Promise<void>;
    flightBookingCancel(): Promise<void>;
    processApi(bdfaredto: RequestDto): Promise<any>;
}
