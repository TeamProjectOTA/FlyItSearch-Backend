import { BookingService } from 'src/book/booking.service';
import { MailService } from 'src/mail/mail.service';
import { PaymentService } from 'src/payment/payment.service';
import { BookingIdSave } from '../flight.model';
import { Repository } from 'typeorm';
export declare class FlyHubUtil {
    private readonly BookService;
    private readonly mailService;
    private readonly paymentService;
    private readonly bookingIdSave;
    constructor(BookService: BookingService, mailService: MailService, paymentService: PaymentService, bookingIdSave: Repository<BookingIdSave>);
    restBFMParser(SearchResponse: any, journeyType?: string): Promise<any[]>;
    airRetriveDataTransformer(SearchResponse: any, fisId: string, header?: any): Promise<any>;
    bookingDataTransformerFlyhb(SearchResponse: any, header?: any, currentTimestamp?: Date): Promise<any>;
    bookingCancelDataTranformerFlyhub(SearchResponse: any, fisId: string, header?: any): Promise<any>;
    saveBookingData(SearchResponse: any, header?: any, bookingId?: string): Promise<any>;
}
