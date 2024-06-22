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
exports.JwtMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../auth/auth.service");
const jwt_constaints_1 = require("../auth/jwt.constaints");
let JwtMiddleware = class JwtMiddleware {
    constructor(jwtService, authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }
    async use(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            req.user = { role: 'unregistered' };
            return next();
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            req.user = { role: 'unregistered' };
            return next();
        }
        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: jwt_constaints_1.jwtConstants.secret,
            });
            const emailOrUUID = decoded.sub;
            const user = await this.authService
                .getUserByEmail(emailOrUUID)
                .catch(() => null);
            if (user) {
                req.user = { email: user.email, role: user.role };
                return next();
            }
            const admin = await this.authService
                .getAdminByUUID(emailOrUUID)
                .catch(() => null);
            if (admin) {
                req.user = { uuid: admin.uuid, role: admin.role };
                return next();
            }
            throw new common_1.UnauthorizedException('User or Admin not found');
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.JwtMiddleware = JwtMiddleware;
exports.JwtMiddleware = JwtMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        auth_service_1.AuthService])
], JwtMiddleware);
//# sourceMappingURL=jwt.middleware.js.map