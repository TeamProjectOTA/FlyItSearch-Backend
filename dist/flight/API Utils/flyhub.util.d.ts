import { BookingService } from 'src/book/booking.service';
import { MailService } from 'src/mail/mail.service';
import { PaymentService } from 'src/payment/payment.service';
export declare class FlyHubUtil {
    private readonly BookService;
    private readonly mailService;
    private readonly paymentService;
    constructor(BookService: BookingService, mailService: MailService, paymentService: PaymentService);
    restBFMParser(SearchResponse: any, journeyType?: string): Promise<any[]>;
    airRetriveDataTransformer(SearchResponse: any): Promise<any>;
    bookingDataTransformerFlyhb(SearchResponse: any, header?: any, currentTimestamp?: Date): Promise<any>;
    saveBookingData(SearchResponse: any, header?: any): Promise<any>;
}
