import { TermsAndConditionsService } from './terms-and-conditions.service';
import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
export declare class TermsAndConditionsController {
    private readonly termsAndConditionsService;
    constructor(termsAndConditionsService: TermsAndConditionsService);
    findAll(): Promise<import("./entities/terms-and-condition.entity").TermsAndCondition[]>;
    update(id: string, updateTermsAndConditionDto: UpdateTermsAndConditionDto): string;
}
