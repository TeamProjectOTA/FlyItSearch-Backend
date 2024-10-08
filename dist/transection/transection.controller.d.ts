import { TransectionService } from './transection.service';
import { CreateTransectionDto } from './transection.model';
export declare class TransectionController {
    private readonly TranserctionService;
    constructor(TranserctionService: TransectionService);
    walletTransection(header: Headers, transectionDto: CreateTransectionDto): Promise<string | import("./transection.model").Transection>;
}
