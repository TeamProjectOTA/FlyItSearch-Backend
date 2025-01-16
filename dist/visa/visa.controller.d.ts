import { VisaService } from './visa.service';
import { VisaAllDto } from './dto/visa-all.dto';
import { Visa } from './entity/visa.entity';
export declare class VisaController {
    private readonly visaService;
    constructor(visaService: VisaService);
    create(visaAllDto: VisaAllDto): Promise<Visa>;
    findAll(page?: number, limit?: number): Promise<any>;
    findOne(id: number): Promise<Visa>;
    delete(id: number): Promise<any>;
    updateVisa(id: number, visaAllDto: VisaAllDto): Promise<Visa>;
}
