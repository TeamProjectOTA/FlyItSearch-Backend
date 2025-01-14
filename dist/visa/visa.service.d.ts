import { Repository } from 'typeorm';
import { VisaAllDto } from './dto/visa-all.dto';
import { Visa } from './entity/visa.entity';
import { DurationCost } from './entity/duration-cost.entity';
import { VisaRequiredDocuments } from './entity/visa-required-documents.entity';
export declare class VisaService {
    private readonly visaRepository;
    private readonly durationCostRepository;
    private readonly visaRequiredDocumentsRepository;
    constructor(visaRepository: Repository<Visa>, durationCostRepository: Repository<DurationCost>, visaRequiredDocumentsRepository: Repository<VisaRequiredDocuments>);
    createVisaAll(visaAllDto: VisaAllDto): Promise<Visa>;
    findAll(page?: number, limit?: number): Promise<{
        data: Visa[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Visa>;
    deleteVisa(id: number): Promise<any>;
}
