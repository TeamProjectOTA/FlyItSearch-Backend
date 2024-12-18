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
exports.WhitelistGuard = void 0;
const common_1 = require("@nestjs/common");
const whitelist_1 = require("./whitelist");
let WhitelistGuard = class WhitelistGuard {
    constructor(whitelistService) {
        this.whitelistService = whitelistService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        let clientIP = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
        if (clientIP.startsWith('::ffff:')) {
            clientIP = clientIP.replace('::ffff:', '');
        }
        if (clientIP.startsWith('::')) {
            clientIP = clientIP.replace('::', '');
        }
        const allowedIPs = await this.whitelistService.findAll();
        if (!allowedIPs.includes(clientIP)) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        return true;
    }
};
exports.WhitelistGuard = WhitelistGuard;
exports.WhitelistGuard = WhitelistGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [whitelist_1.WhitelistService])
], WhitelistGuard);
//# sourceMappingURL=whitelist.guard.js.map