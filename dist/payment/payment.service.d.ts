import { AuthService } from 'src/auth/auth.service';
import { BookingSave } from 'src/book/booking.model';
import { Wallet } from 'src/deposit/deposit.model';
import { Transection } from 'src/transection/transection.model';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class PaymentService {
    private readonly bookingSaveRepository;
    private readonly transectionRepository;
    private readonly userRepository;
    private readonly walletRepository;
    private readonly authService;
    private readonly sslcommerzsslcommerzStoreId;
    private readonly sslcommerzStorePwd;
    private readonly isLive;
    private bkashConfig;
    private surjoBaseUrl;
    private surjoUserName;
    private surjoPassword;
    private surjoPrefix;
    constructor(bookingSaveRepository: Repository<BookingSave>, transectionRepository: Repository<Transection>, userRepository: Repository<User>, walletRepository: Repository<Wallet>, authService: AuthService);
    dataModification(SearchResponse: any, header: any): Promise<any>;
    initiatePayment(paymentData: any, bookingId: string, header: any): Promise<string>;
    validateOrder(val_id: string, bookingId?: any, email?: any): Promise<any>;
    bkashInit(SearchResponse: any, header: any): Promise<{
        url: any;
        airTicketPrice: any;
        paymentGatwayCharge: number;
        total_amount: number;
    }>;
    createPaymentBkash(amount: number, bookingId: string, header: any, netAmount: string): Promise<any>;
    executePaymentBkash(paymentID: string, status: string, bookingId: string, res: any, offerAmount: string): Promise<any>;
    searchTransaction(transactionId: string): Promise<any>;
    refundTransaction(paymentId: string, amount: number, trxID: string, email: string): Promise<any>;
    formdata(SearchResponse?: any, header?: any, userIp?: any): Promise<{
        url: any;
        airTicketPrice: any;
        paymentGatwayCharge: number;
        total_amount: number;
    }>;
    surjoAuthentication(): Promise<any>;
    surjoMakePayment(data: any, bookingId: string, header: any, userIp: any): Promise<any>;
    surjoVerifyPayment(sp_order_id: string, bookingID: string, email: string, res: any): Promise<any>;
}
