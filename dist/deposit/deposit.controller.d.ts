import { DepositService } from './deposit.service';
import { Deposit } from './deposit.model';
export declare class DepositController {
    private readonly depositService;
    constructor(depositService: DepositService);
    createDeposit(depositData: Partial<Deposit>, header: any): Promise<Deposit>;
    findAllDepositForUser(header: any): Promise<any>;
    findAllDepositForAdmin(): Promise<Deposit[]>;
    actionOnDeposit(updateData: {
        status: string;
        rejectionReason: string;
    }, depositId: string): Promise<Deposit>;
    wallet(header: any): Promise<import("./deposit.model").Wallet>;
}
