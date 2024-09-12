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
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const ip_service_1 = require("../ip/ip.service");
const rateLimiterByRole = {
    unregistered: new rate_limiter_flexible_1.RateLimiterMemory({
        points: 10,
        duration: 86400,
    }),
    registered: new rate_limiter_flexible_1.RateLimiterMemory({
        points: 50,
        duration: 86400,
    }),
    admin: new rate_limiter_flexible_1.RateLimiterMemory({
        points: Number.MAX_SAFE_INTEGER,
        duration: 86400,
    }),
    superAdmin: new rate_limiter_flexible_1.RateLimiterMemory({
        points: Number.MAX_SAFE_INTEGER,
        duration: 86400,
    }),
};
let RateLimiterMiddleware = class RateLimiterMiddleware {
    constructor(ipService) {
        this.ipService = ipService;
    }
    async use(req, res, next) {
        const ip = req.ip;
        const userRole = req.user?.role || 'unregistered';
        const rateLimiter = rateLimiterByRole[userRole] || rateLimiterByRole.unregistered;
        try {
            await rateLimiter.consume(ip);
            if (userRole !== 'unregistered') {
                const currentTime = Date.now();
                const duration = 86400 * 1000;
                let ipAddress = await this.ipService.findOne(ip);
                if (ipAddress) {
                    if (ipAddress.role !== userRole) {
                        ipAddress.points = rateLimiter.points - 1;
                        ipAddress.role = userRole;
                        ipAddress.lastRequestTime = currentTime;
                    }
                    else if (ipAddress.lastRequestTime + duration > currentTime) {
                        ipAddress.points = Math.max(ipAddress.points - 1, 0);
                    }
                    else {
                        ipAddress.points = rateLimiter.points - 1;
                        ipAddress.lastRequestTime = currentTime;
                    }
                }
                else {
                    ipAddress = await this.ipService.create(ip, userRole, rateLimiter.points - 1, currentTime);
                }
                await this.ipService.createOrUpdate(ip, userRole, ipAddress.points, currentTime);
            }
            next();
        }
        catch {
            if (userRole == 'registered') {
                res.status(common_1.HttpStatus.TOO_MANY_REQUESTS).json({
                    message: 'Your Search limit is exited for today. Contect with help-line ',
                });
            }
            else if (userRole == 'unregistered') {
                res
                    .status(common_1.HttpStatus.TOO_MANY_REQUESTS)
                    .json({ message: 'Sign up to get more search ' });
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