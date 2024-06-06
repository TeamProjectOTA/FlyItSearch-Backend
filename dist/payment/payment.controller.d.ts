import { PaymentService } from './payment.service';
import { Response } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    getPaymentUrl(res: Response, passengerId: string): Promise<{
        url: string;
        statusCode: number;
        message?: undefined;
    } | {
        message: string;
        url?: undefined;
        statusCode?: undefined;
    }>;
    validateOrder(val_id: string): Promise<{
        data: any;
        message?: undefined;
    } | {
        message: string;
        data?: undefined;
    }>;
    redirectSuccess(res: Response): void;
    redirectFail(res: Response): void;
    redirectCancel(res: Response): void;
}
