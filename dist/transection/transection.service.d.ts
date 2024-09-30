import { AuthService } from 'src/auth/auth.service';
import { BookingSave } from 'src/book/booking.model';
import { Repository } from 'typeorm';
import { CreateTransectionDto, Transection } from './transection.model';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/deposit/deposit.model';
export declare class TransectionService {
    private readonly authService;
    private readonly bookingRepository;
    private readonly userRepository;
    private readonly walletRepository;
    private readonly transectionRepoistory;
    constructor(authService: AuthService, bookingRepository: Repository<BookingSave>, userRepository: Repository<User>, walletRepository: Repository<Wallet>, transectionRepoistory: Repository<Transection>);
    paymentWithWallet(header: any, transectiondto: CreateTransectionDto): Promise<Transection>;
}
