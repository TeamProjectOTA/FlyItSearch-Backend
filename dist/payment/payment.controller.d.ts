import { PaymentService } from './payment.service';
import { Response, Request } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    handleSuccess(bookingId: string, email: string, req: Request, res: Response): Promise<void>;
    handleFail(res: Response): void;
    handleCancel(res: Response): void;
    handleIPN(req: Request, res: Response): Promise<void>;
    initiatePayment(amount: number): Promise<any>;
    executePayment(paymentID: string): Promise<any>;
    queryPayment(paymentID: string): Promise<any>;
    searchTransaction(trxID: string): Promise<any>;
    refundTransaction(paymentID: string, amount: number, trxID: string): Promise<any>;
    callback(res: any): Promise<void>;
    checkCredentials(body: {
        username: string;
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    test(): Promise<any>;
    paymentReturn(bookingID: string, email: string, order_id: string): Promise<{
        message: string;
        data: any;
    }>;
}
