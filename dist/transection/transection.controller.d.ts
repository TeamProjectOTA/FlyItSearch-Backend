import { TransectionService } from "./transection.service";
export declare class TransectionController {
    private readonly TranserctionService;
    constructor(TranserctionService: TransectionService);
    walletTransection(): Promise<void>;
}
