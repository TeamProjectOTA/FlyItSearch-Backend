import { DepositService } from './deposit.service';
import { Deposit, DepositDto } from './deposit.model';
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
    sslcommerz(header: any, depositDto: DepositDto): Promise<{
        sslcommerz: any;
    }>;
    depositSuccessSSLCommerz(email: string, amount: number, req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
    surjoPay(header: any, depositDto: DepositDto, request: Request): Promise<"Payment Failed" | {
        surjoPay: any;
    }>;
    depositSuccessSurjoPay(email: string, order_id: string, res: Response): Promise<any>;
    bkash(header: any, depositDto: DepositDto): Promise<{
        bkash: any;
    }>;
    handlePaymentCallback(paymentID: string, status: string, amount: number, res: Response): Promise<any>;
}
