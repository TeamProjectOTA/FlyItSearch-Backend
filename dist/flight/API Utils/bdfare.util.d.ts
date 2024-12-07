import { AirportsService } from 'src/airports/airports.service';
import { BookingIdSave } from '../flight.model';
import { Repository } from 'typeorm';
import { BookingSave } from 'src/book/booking.model';
export declare class BfFareUtil {
    private readonly airportService;
    private readonly bookingIdSave;
    private readonly bookingSave;
    constructor(airportService: AirportsService, bookingIdSave: Repository<BookingIdSave>, bookingSave: Repository<BookingSave>);
    afterSerarchDataModifierBdFare(SearchResponse: any, journeyType?: string): Promise<any[]>;
    priceCheckWithAlldata(SearchResponse: any, journeyType?: string): Promise<any[]>;
    airRetrive(SearchResponse: any, journeyType?: string): Promise<any>;
    bookingDataTransformer(SearchResponse: any, header: any, currentTimestamp: any, personIds: any): Promise<any>;
}
