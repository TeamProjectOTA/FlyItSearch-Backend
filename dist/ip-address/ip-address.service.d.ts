import { Repository } from 'typeorm';
import { IpAddress } from './ip-address.model';
export declare class IpAddressService {
    private readonly ipAddressRepository;
    constructor(ipAddressRepository: Repository<IpAddress>);
    getCount(ip: string): Promise<number>;
    getTimestamp(ip: string): Promise<Date>;
    resetCount(ip: string): Promise<void>;
    incrementCount(ip: string): Promise<void>;
}
