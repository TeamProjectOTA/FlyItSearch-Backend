"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiterMiddleware = void 0;
const common_1 = require("@nestjs/common");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const rateLimiterByRole = {
    unregistered: new rate_limiter_flexible_1.RateLimiterMemory({
        points: 10,
        duration: 86400,
    }),
    registered: new rate_limiter_flexible_1.RateLimiterMemory({
        points: 100,
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
    use(req, res, next) {
        const ip = req.ip;
        const userRole = req.user?.role || 'unregistered';
        const day = Date.now();
        const rateLimiter = rateLimiterByRole[userRole] || rateLimiterByRole.unregistered;
        rateLimiter.consume(ip)
            .then(() => {
            next();
        })
            .catch(() => {
            const resetTime = new Date(Date.now() + 86400 * 1000);
            const resetTimeString = resetTime.toLocaleString();
            res.status(common_1.HttpStatus.TOO_MANY_REQUESTS).json({ message: `Limit over for today. Try again at ${resetTimeString}` });
        });
    }
};
exports.RateLimiterMiddleware = RateLimiterMiddleware;
exports.RateLimiterMiddleware = RateLimiterMiddleware = __decorate([
    (0, common_1.Injectable)()
], RateLimiterMiddleware);
//# sourceMappingURL=rate-limiter.middleware.js.map