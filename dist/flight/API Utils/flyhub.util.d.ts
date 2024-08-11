import { BookingService } from 'src/book/booking.service';
import { MailService } from 'src/mail/mail.service';
export declare class FlyHubUtil {
    private readonly BookService;
    private readonly mailService;
    constructor(BookService: BookingService, mailService: MailService);
    restBFMParser(SearchResponse: any, journeyType?: string): Promise<any[]>;
    dataTransformer(SearchResponse: any): Promise<any[]>;
    bookingDataTransformerFlyhb(SearchResponse: any, currentTimestamp?: any, header?: any): Promise<any[]>;
    saveBookingData(SearchResponse: any, header?: any): Promise<any>;
}
