import { PaymentService } from './payment.service';
import { Response, Request } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    handleSuccess(bookingId: string, email: string, req: Request, res: Response): Promise<void>;
    handleFail(res: Response): void;
    handleCancel(res: Response): void;
    handleIPN(req: Request, res: Response): Promise<void>;
    handlePaymentCallback(bookingId: string, paymentID: string, status: string, signature: string, res: Response): Promise<any>;
    paymentReturn(bookingID: string, email: string, order_id: string): Promise<{
        message: string;
        data: any;
    }>;
    createPayment(amount: number, header: Headers, bookingId: string): Promise<any>;
    queryPayment(paymentId: string): Promise<any>;
    searchTransaction(transactionId: string): Promise<any>;
    refundTransaction(paymentId: string, amount: number): Promise<any>;
}
