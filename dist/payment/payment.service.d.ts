export declare class PaymentService {
    private readonly storeId;
    private readonly storePassword;
    private readonly isLive;
    constructor();
    dataModification(SearchResponse: any): Promise<any>;
    initiatePayment(paymentData: any): Promise<string>;
    validateOrder(val_id: string): Promise<any>;
}
