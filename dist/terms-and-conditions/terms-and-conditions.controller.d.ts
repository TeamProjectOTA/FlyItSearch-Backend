import { TermsAndConditionsService } from './terms-and-conditions.service';
import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
export declare class TermsAndConditionsController {
    private readonly termsAndConditionsService;
    constructor(termsAndConditionsService: TermsAndConditionsService);
    findAllsite(catagory: string): Promise<import("./entities/terms-and-condition.entity").TermsAndCondition>;
    updatesite(catagory: string, updateTermsAndConditionDto: UpdateTermsAndConditionDto): Promise<{
        message: string;
    }>;
}
