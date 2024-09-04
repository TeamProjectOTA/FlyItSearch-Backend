import { PaymentService } from './payment.service';
import { Response, Request } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    getPaymentUrl(res: Response, paymentData: any): Promise<void>;
    handleSuccess(req: Request, res: Response): Promise<void>;
    handleFail(res: Response): void;
    handleCancel(res: Response): void;
    handleIPN(req: Request, res: Response): Promise<void>;
}
