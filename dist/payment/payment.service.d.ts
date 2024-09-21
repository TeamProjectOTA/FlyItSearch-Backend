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
    private readonly storeId;
    private readonly storePassword;
    private readonly isLive;
    constructor(bookingSaveRepository: Repository<BookingSave>, transectionRepository: Repository<Transection>, userRepository: Repository<User>, walletRepository: Repository<Wallet>, authService: AuthService);
    dataModification(SearchResponse: any, header: any): Promise<any>;
    initiatePayment(paymentData: any, bookingId: string, header: any): Promise<string>;
    validateOrder(val_id: string, bookingId?: any, email?: any): Promise<any>;
}
