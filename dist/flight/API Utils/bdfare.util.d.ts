import { AirportsService } from 'src/airports/airports.service';
import { BookingIdSave } from '../flight.model';
import { Repository } from 'typeorm';
import { BookingSave } from 'src/book/booking.model';
import { BookingService } from 'src/book/booking.service';
export declare class BfFareUtil {
    private readonly airportService;
    private readonly BookService;
    private readonly bookingIdSave;
    private readonly bookingSave;
    constructor(airportService: AirportsService, BookService: BookingService, bookingIdSave: Repository<BookingIdSave>, bookingSave: Repository<BookingSave>);
    afterSerarchDataModifierBdFare(SearchResponse: any, journeyType?: string): Promise<any[]>;
    priceCheckWithAlldata(SearchResponse: any, journeyType?: string): Promise<any[]>;
    airRetrive(SearchResponse: any, fisId: string, bookingStatus?: any, tripType?: any, bookingDate?: any, header?: any): Promise<any>;
    bookingDataTransformer(SearchResponse: any, header: any, currentTimestamp: any, personIds: any): Promise<any>;
    saveBookingData(SearchResponse: any, header: any, personIds: any): Promise<any>;
}
