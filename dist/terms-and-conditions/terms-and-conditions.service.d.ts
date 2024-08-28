import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
import { TermsAndCondition } from './entities/terms-and-condition.entity';
import { Repository } from 'typeorm';
export declare class TermsAndConditionsService {
    private readonly termAndConditionRepository;
    constructor(termAndConditionRepository: Repository<TermsAndCondition>);
    findAllSite(catagory: string): Promise<TermsAndCondition>;
    updateSite(updateTermsAndConditionDto: UpdateTermsAndConditionDto, catagory: string): Promise<{
        message: string;
    }>;
}
