import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
import { TermsAndCondition } from './entities/terms-and-condition.entity';
import { Repository } from 'typeorm';
export declare class TermsAndConditionsService {
    private readonly termAndConditionRepository;
    constructor(termAndConditionRepository: Repository<TermsAndCondition>);
    findAll(): Promise<TermsAndCondition[]>;
    update(id: number, updateTermsAndConditionDto: UpdateTermsAndConditionDto): string;
    remove(id: number): string;
}
