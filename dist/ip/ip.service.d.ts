import { Repository } from 'typeorm';
import { IpAddress } from './ip.model';
export declare class IpService {
    private readonly ipRepository;
    constructor(ipRepository: Repository<IpAddress>);
    findOne(ip: string): Promise<IpAddress>;
    create(ip: string, role: string, points: number, lastRequestTime: number, email: string): Promise<IpAddress>;
    createOrUpdate(ip: string, role: string, points: number, lastRequestTime: number, email: string): Promise<IpAddress>;
    update(email: string, points: number): Promise<IpAddress>;
    findUser(email: string): Promise<IpAddress>;
    cleanupOldIps(expirationTime: number): Promise<void>;
}
