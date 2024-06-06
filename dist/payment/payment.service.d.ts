import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class PaymentService {
    private readonly loginRepository;
    private readonly storeId;
    private readonly storePassword;
    private readonly isLive;
    constructor(loginRepository: Repository<User>);
    initiatePayment(passengerId: string): Promise<string>;
    validateOrder(val_id: string): Promise<any>;
}
