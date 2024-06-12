import { Repository } from 'typeorm';
import { IpAddress } from './ip.model';
export declare class IpService {
    private readonly ipRepository;
    constructor(ipRepository: Repository<IpAddress>);
    findOne(ip: string): Promise<IpAddress>;
    create(ip: string, role: string, points: number, lastRequestTime: number): Promise<IpAddress>;
    createOrUpdate(ip: string, role: string, points: number, lastRequestTime: number): Promise<IpAddress>;
    delete(ip: string): Promise<void>;
    cleanupOldIps(expirationTime: number): Promise<void>;
}
