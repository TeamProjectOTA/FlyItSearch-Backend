import { Repository } from 'typeorm';
import { HotDeals, HotDealsDto } from './hotdeals.model';
export declare class HotDealsService {
    private readonly tourPacageRepository;
    constructor(tourPacageRepository: Repository<HotDeals>);
    create(tourPackageDto: HotDealsDto, paths: string[], fileDetails: {
        path: string;
        size: number;
    }[]): Promise<HotDeals>;
    findOne(category: string): Promise<HotDeals[]>;
    Delete(title: string): Promise<{
        findDeals: HotDeals;
        deleteDeals: import("typeorm").DeleteResult;
    }>;
}
