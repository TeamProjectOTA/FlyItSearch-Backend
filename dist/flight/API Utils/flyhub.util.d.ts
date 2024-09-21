import { BookingService } from 'src/book/booking.service';
import { MailService } from 'src/mail/mail.service';
import { PaymentService } from 'src/payment/payment.service';
import { BookingIdSave } from '../flight.model';
import { Repository } from 'typeorm';
import { TransectionService } from 'src/transection/transection.service';
export declare class FlyHubUtil {
    private readonly BookService;
    private readonly mailService;
    private readonly paymentService;
    private readonly transectionService;
    private readonly bookingIdSave;
    constructor(BookService: BookingService, mailService: MailService, paymentService: PaymentService, transectionService: TransectionService, bookingIdSave: Repository<BookingIdSave>);
    restBFMParser(SearchResponse: any, journeyType?: string): Promise<any[]>;
    airRetriveDataTransformer(SearchResponse: any, fisId: string, bookingStatus?: any, header?: any): Promise<any>;
    bookingDataTransformerFlyhb(SearchResponse: any, header?: any, currentTimestamp?: any): Promise<any>;
    saveBookingData(SearchResponse: any, header?: any, bookingId?: string): Promise<any>;
    bookingCancelDataTranformerFlyhub(SearchResponse: any, fisId: string, header?: any): Promise<any>;
}
