import { BookingSave } from 'src/book/booking.model';
import { Repository } from 'typeorm';
export declare class PaymentService {
    private readonly bookingSaveRepository;
    private readonly storeId;
    private readonly storePassword;
    private readonly isLive;
    constructor(bookingSaveRepository: Repository<BookingSave>);
    dataModification(SearchResponse: any): Promise<any>;
    initiatePayment(paymentData: any, bookingId: string): Promise<string>;
    validateOrder(val_id: string, bookingId?: any): Promise<any>;
}
