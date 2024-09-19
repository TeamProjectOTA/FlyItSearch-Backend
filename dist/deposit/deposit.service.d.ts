import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Deposit, Wallet } from './deposit.model';
import { AuthService } from 'src/auth/auth.service';
import { Transection } from 'src/transection/transection.model';
export declare class DepositService {
    private readonly depositRepository;
    private readonly userRepository;
    private readonly walletRepository;
    private readonly transectionRepository;
    private readonly authService;
    constructor(depositRepository: Repository<Deposit>, userRepository: Repository<User>, walletRepository: Repository<Wallet>, transectionRepository: Repository<Transection>, authService: AuthService);
    createDeposit(depositData: Partial<Deposit>, header: any): Promise<Deposit>;
    getDepositforUser(header: any): Promise<any>;
    findAllDeposit(): Promise<Deposit[]>;
    updateDepositStatus(depositId: string, updateData: {
        status: string;
        rejectionReason?: string;
    }): Promise<Deposit>;
    wallet(header: any): Promise<Wallet>;
}
