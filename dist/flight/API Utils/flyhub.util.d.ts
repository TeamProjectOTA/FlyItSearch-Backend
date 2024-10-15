import { BookingService } from 'src/book/booking.service';
import { MailService } from 'src/mail/mail.service';
import { PaymentService } from 'src/payment/payment.service';
import { BookingIdSave } from '../flight.model';
import { Repository } from 'typeorm';
import { TransectionService } from 'src/transection/transection.service';
import { Wallet } from 'src/deposit/deposit.model';
import { AuthService } from 'src/auth/auth.service';
import { BookingSave } from 'src/book/booking.model';
export declare class FlyHubUtil {
    private readonly BookService;
    private readonly mailService;
    private readonly paymentService;
    private readonly authService;
    private readonly transectionService;
    private readonly bookingIdSave;
    private readonly walletRepository;
    private readonly bookingSave;
    constructor(BookService: BookingService, mailService: MailService, paymentService: PaymentService, authService: AuthService, transectionService: TransectionService, bookingIdSave: Repository<BookingIdSave>, walletRepository: Repository<Wallet>, bookingSave: Repository<BookingSave>);
    restBFMParser(SearchResponse: any, journeyType?: string): Promise<any[]>;
    airRetriveDataTransformer(SearchResponse: any, fisId: string, bookingStatus?: any, tripType?: any, bookingDate?: any, header?: any): Promise<any>;
    bookingDataTransformerFlyhb(SearchResponse: any, header?: any, currentTimestamp?: any): Promise<any>;
    saveBookingData(SearchResponse: any, header?: any, bookingId?: string): Promise<any>;
    bookingCancelDataTranformerFlyhub(SearchResponse: any, fisId: string, header?: any): Promise<any>;
    airRetriveDataTransformerAdmin(SearchResponse: any, fisId: string, bookingStatus?: any, tripType?: any, bookingDate?: any): Promise<any>;
}
