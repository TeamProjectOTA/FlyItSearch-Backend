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
exports.RateLimiterGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const ip_service_1 = require("./ip.service");
const auth_service_1 = require("../auth/auth.service");
const jwt_constaints_1 = require("../auth/jwt.constaints");
let RateLimiterGuard = class RateLimiterGuard {
    constructor(ipService, jwtService, authService) {
        this.ipService = ipService;
        this.jwtService = jwtService;
        this.authService = authService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const xForwardedFor = request.headers['x-forwarded-for'];
        let ip;
        if (typeof xForwardedFor === 'string') {
            ip = xForwardedFor.split(',')[0];
        }
        else if (Array.isArray(xForwardedFor)) {
            ip = xForwardedFor[0];
        }
        else {
            ip = request.socket.remoteAddress || '';
        }
        let userRole = 'unregistered';
        let email = null;
        const authHeader = request.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (token) {
                try {
                    const decoded = await this.jwtService.verifyAsync(token, {
                        secret: jwt_constaints_1.jwtConstants.secret,
                    });
                    const emailOrUUID = decoded.sub;
                    const user = await this.authService
                        .getUserByEmail(emailOrUUID)
                        .catch(() => null);
                    if (user) {
                        userRole = user.role;
                        email = user.email;
                    }
                    else {
                        const admin = await this.authService
                            .getAdminByUUID(emailOrUUID)
                            .catch(() => null);
                        if (admin) {
                            userRole = admin.role;
                            email = null;
                        }
                    }
                }
                catch (err) {
                    throw new common_1.UnauthorizedException('Invalid or expired token');
                }
            }
        }
        const rateLimits = {
            unregistered: { points: 15, duration: 86400 },
            registered: { points: 60, duration: 86400 },
            admin: { points: Number.MAX_SAFE_INTEGER, duration: 86400 },
            superAdmin: { points: Number.MAX_SAFE_INTEGER, duration: 86400 },
        };
        const { points, duration } = rateLimits[userRole] || rateLimits.unregistered;
        const currentTime = Date.now();
        try {
            let ipAddress = await this.ipService.findOne(ip);
            if (ipAddress) {
                if (ipAddress.role !== userRole) {
                    ipAddress.points = points - 1;
                    ipAddress.role = userRole;
                    ipAddress.lastRequestTime = currentTime;
                }
                else if (ipAddress.lastRequestTime + duration * 1000 > currentTime) {
                    if (ipAddress.points > 0) {
                        ipAddress.points -= 1;
                    }
                    else {
                        throw new common_1.HttpException(userRole === 'registered'
                            ? 'Your search limit is exceeded for today. Contact help-line.'
                            : 'Sign up to get more searches.', common_1.HttpStatus.TOO_MANY_REQUESTS);
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
            await this.ipService.createOrUpdate(ip, userRole, ipAddress.points, currentTime, email);
            return true;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
};
exports.RateLimiterGuard = RateLimiterGuard;
exports.RateLimiterGuard = RateLimiterGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ip_service_1.IpService,
        jwt_1.JwtService,
        auth_service_1.AuthService])
], RateLimiterGuard);
//# sourceMappingURL=ratelimiterguard.js.map