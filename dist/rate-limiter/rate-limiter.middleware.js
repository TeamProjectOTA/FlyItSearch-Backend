"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiterMiddleware = void 0;
const common_1 = require("@nestjs/common");
const ip_service_1 = require("../ip/ip.service");
let RateLimiterMiddleware = class RateLimiterMiddleware {
    constructor(ipService) {
        this.ipService = ipService;
        this.rateLimits = {
            unregistered: { points: 25, duration: 86400 * 1000 },
            registered: { points: 70, duration: 86400 * 1000 },
            admin: { points: Number.MAX_SAFE_INTEGER, duration: 86400 * 1000 },
            superAdmin: { points: Number.MAX_SAFE_INTEGER, duration: 86400 * 1000 },
        };
    }
    async use(req, res, next) {
        const ip = req.ip;
        const userRole = req.user?.role || 'unregistered';
        const email = req.user?.email;
        const { points, duration } = this.rateLimits[userRole];
        try {
            let ipAddress;
            if (email) {
                ipAddress = await this.ipService.findByEmail(email);
            }
            if (!ipAddress) {
                ipAddress = await this.ipService.findOne(ip);
            }
            const currentTime = Date.now();
            if (ipAddress) {
                if (ipAddress.role !== userRole) {
                    ipAddress.points = points - 1;
                    ipAddress.role = userRole;
                    ipAddress.lastRequestTime = currentTime;
                }
                else if (ipAddress.lastRequestTime + duration > currentTime) {
                    if (ipAddress.points > 0) {
                        ipAddress.points -= 1;
                    }
                    else {
                        throw new Error('Rate limit exceeded');
                    }
                }
                else {
                    ipAddress.points = points - 1;
                    ipAddress.lastRequestTime = currentTime;
                }
            }
            else {
                ipAddress = await this.ipService.create(ip, userRole, points - 1, currentTime, email);
            }
            await this.ipService.createOrUpdate(ipAddress.ip, userRole, ipAddress.points, currentTime, email);
            next();
        }
        catch (error) {
            if (userRole === 'registered') {
                res.status(common_1.HttpStatus.TOO_MANY_REQUESTS).json({
                    message: 'Your search limit has been exceeded for today. Please contact the help desk.',
                });
            }
            else if (userRole === 'unregistered') {
                res.status(common_1.HttpStatus.TOO_MANY_REQUESTS).json({
                    message: 'Sign up to get more searches.',
                });
            }
            else {
                res.status(common_1.HttpStatus.TOO_MANY_REQUESTS).json({
                    message: 'Rate limit exceeded. Please try again later.',
                });
            }
        }
    }
};
exports.RateLimiterMiddleware = RateLimiterMiddleware;
exports.RateLimiterMiddleware = RateLimiterMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ip_service_1.IpService])
], RateLimiterMiddleware);
//# sourceMappingURL=rate-limiter.middleware.js.map