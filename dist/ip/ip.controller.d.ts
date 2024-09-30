import { IpService } from './ip.service';
export declare class IpController {
    private readonly ipService;
    constructor(ipService: IpService);
    searchCount(email: string, points: number): Promise<import("./ip.model").IpAddress>;
}
