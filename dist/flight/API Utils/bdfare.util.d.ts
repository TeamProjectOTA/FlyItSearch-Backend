import { AirportsService } from 'src/airports/airports.service';
import { BookingIdSave } from '../flight.model';
import { Repository } from 'typeorm';
import { BookingSave } from 'src/book/booking.model';
import { BookingService } from 'src/book/booking.service';
import { PaymentService } from 'src/payment/payment.service';
export declare class BfFareUtil {
    private readonly paymentService;
    private readonly airportService;
    private readonly BookService;
    private readonly bookingIdSave;
    private readonly bookingSave;
    markupPersentange: number;
    constructor(paymentService: PaymentService, airportService: AirportsService, BookService: BookingService, bookingIdSave: Repository<BookingIdSave>, bookingSave: Repository<BookingSave>);
    afterSerarchDataModifierBdFare(SearchResponse: any, journeyType?: string): Promise<any[]>;
    priceCheckWithAlldata(SearchResponse: any, journeyType?: string): Promise<any[]>;
    airRetrive(SearchResponse: any, fisId: string, bookingStatus?: any, tripType?: any, bookingDate?: any, header?: any, userIp?: any): Promise<any>;
    bookingDataTransformer(SearchResponse: any, header: any, currentTimestamp: any, personIds: any, userIp: any): Promise<any>;
    saveBookingData(SearchResponse: any, header: any, personIds: any): Promise<any>;
}
