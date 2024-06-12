import { IpService } from './ip.service';
export declare class IpCleanupService {
    private readonly ipService;
    constructor(ipService: IpService);
    handleCleanup(): Promise<void>;
}
