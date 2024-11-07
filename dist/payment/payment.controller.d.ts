import { PaymentService } from './payment.service';
import { Response, Request } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    handleSuccess(email: string, amount: number, req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
    handleFail(res: Response): Promise<void>;
    handleCancel(res: Response): Promise<void>;
    handleIPN(req: Request, res: Response): Promise<void>;
    handlePaymentCallback(bookingId: string, email: string, paymentID: string, status: string, signature: string, res: Response): Promise<any>;
    paymentReturn(bookingID: string, email: string, order_id: string, res: Response): Promise<{
        message: string;
        data: any;
    }>;
    createPayment(amount: number, header: Headers, bookingId: string): Promise<any>;
    queryPayment(paymentId: string): Promise<any>;
    searchTransaction(transactionId: string): Promise<any>;
    refundTransaction(paymentId: string, trxID: string, amount: number): Promise<any>;
    surjotest(): Promise<any>;
}
