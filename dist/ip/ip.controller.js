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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpController = void 0;
const common_1 = require("@nestjs/common");
const ip_service_1 = require("./ip.service");
const swagger_1 = require("@nestjs/swagger");
let IpController = class IpController {
    constructor(ipService) {
        this.ipService = ipService;
    }
    async searchCount(email, points) {
        return await this.ipService.update(email, points);
    }
    getRequestInfo(request) {
        const xForwardedFor = request.headers['x-forwarded-for'];
        const ipList = xForwardedFor?.split(',').map((ip) => ip.trim());
        const userIp = ipList?.[0] || request.socket.remoteAddress;
        return {
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: request.body,
            ip: userIp,
            query: request.query,
            params: request.params,
            xForwardedFor: xForwardedFor || 'Not Available',
        };
    }
};
exports.IpController = IpController;
__decorate([
    (0, common_1.Patch)('admin/updatelimit/:email/:points'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('points')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], IpController.prototype, "searchCount", null);
__decorate([
    (0, common_1.Get)('/ipcheck'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], IpController.prototype, "getRequestInfo", null);
exports.IpController = IpController = __decorate([
    (0, swagger_1.ApiTags)('SearchCount'),
    (0, common_1.Controller)('SearchCount'),
    __metadata("design:paramtypes", [ip_service_1.IpService])
], IpController);
//# sourceMappingURL=ip.controller.js.map