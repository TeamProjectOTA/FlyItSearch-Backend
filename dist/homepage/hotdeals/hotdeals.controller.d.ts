import { HotDealsService } from './hotdeals.service';
import { HotDeals, HotDealsDto } from './hotdeals.model';
export declare class HotDealsController {
    private readonly tourpackageService;
    constructor(tourpackageService: HotDealsService);
    create(tourpackageDto: HotDealsDto, files: Express.Multer.File[]): Promise<HotDeals>;
    findOne(category: string): Promise<HotDeals[]>;
    Delete(title: string): Promise<{
        findDeals: HotDeals;
        deleteDeals: import("typeorm").DeleteResult;
    }>;
}
