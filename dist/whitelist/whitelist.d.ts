import { IPWhitelist, IPWhitelistDTO } from './whitelist.model';
import { Repository } from 'typeorm';
export declare class WhitelistService {
    private readonly ipWhitelistRepository;
    constructor(ipWhitelistRepository: Repository<IPWhitelist>);
    findAll(): Promise<string[]>;
    save(ipWhitelistDTO: IPWhitelistDTO): Promise<IPWhitelist>;
}
