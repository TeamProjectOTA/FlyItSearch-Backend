import { VisaService } from './visa.service';
import { VisaAllDto } from './dto/visa-all.dto';
export declare class VisaController {
    private readonly visaService;
    constructor(visaService: VisaService);
    create(visaAllDto: VisaAllDto): Promise<import("./entity/visa.entity").Visa>;
    findAll(page?: number, limit?: number): Promise<{
        data: import("./entity/visa.entity").Visa[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<import("./entity/visa.entity").Visa>;
    delete(id: number): Promise<any>;
}
