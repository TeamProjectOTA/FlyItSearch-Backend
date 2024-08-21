import { PaymentService } from './payment.service';
import { Response } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    getPaymentUrl(res: Response, paymentData: any): Promise<void>;
    handleSuccess(val_id: string, res: Response): Promise<void>;
    handleFail(res: Response): void;
    handleCancel(res: Response): void;
}
