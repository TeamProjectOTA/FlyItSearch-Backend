import { WhitelistService } from './whitelist';
import { IPWhitelistDTO } from './whitelist.model';
export declare class WhitelistController {
    private readonly whitelistService;
    constructor(whitelistService: WhitelistService);
    findAll(): Promise<string[]>;
    saveData(ipWhitelistDTO: IPWhitelistDTO): Promise<import("./whitelist.model").IPWhitelist>;
}
