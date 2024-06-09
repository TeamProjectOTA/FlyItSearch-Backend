/// <reference types="qs" />
import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { IpAddressService } from '../ip-address/ip-address.service';
export declare class RateLimitingPipe implements PipeTransform {
    private readonly authService;
    private readonly ipAddressService;
    constructor(authService: AuthService, ipAddressService: IpAddressService);
    transform(request: Request, metadata: ArgumentMetadata): Promise<Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>>;
}
