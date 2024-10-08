import { DepositService } from './deposit.service';
import { Deposit } from './deposit.model';
import { Response, Request } from 'express';
export declare class DepositController {
    private readonly depositService;
    constructor(depositService: DepositService);
    createDeposit(file: Express.Multer.File, depositData: Partial<Deposit>, header: any): Promise<Deposit>;
    findAllDepositForUser(header: any): Promise<any>;
    findAllDepositForAdmin(): Promise<Deposit[]>;
    actionOnDeposit(updateData: {
        status: string;
        rejectionReason: string;
    }, depositId: string): Promise<Deposit>;
    wallet(header: any): Promise<import("./deposit.model").Wallet>;
    sslcommerz(header: any, ammount: number): Promise<{
        sslcommerz: any;
    }>;
    depositSuccess(email: string, amount: number, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
