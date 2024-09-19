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
exports.DepositController = void 0;
const common_1 = require("@nestjs/common");
const deposit_service_1 = require("./deposit.service");
const user_tokens_guard_1 = require("../auth/user-tokens.guard");
const swagger_1 = require("@nestjs/swagger");
const admin_tokens_guard_1 = require("../auth/admin.tokens.guard");
let DepositController = class DepositController {
    constructor(depositService) {
        this.depositService = depositService;
    }
    async createDeposit(depositData, header) {
        if (!depositData || Object.keys(depositData).length === 0) {
            throw new common_1.NotFoundException('Deposit data cannot be empty');
        }
        return this.depositService.createDeposit(depositData, header);
    }
    async findAllDepositForUser(header) {
        return this.depositService.getDepositforUser(header);
    }
    async findAllDepositForAdmin() {
        return this.depositService.findAllDeposit();
    }
    async actionOnDeposit(updateData, depositId) {
        return this.depositService.updateDepositStatus(depositId, updateData);
    }
    async wallet(header) {
        return await this.depositService.wallet(header);
    }
};
exports.DepositController = DepositController;
__decorate([
    (0, common_1.Post)('/createDeposit'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "createDeposit", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Get)('user/findAll'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "findAllDepositForUser", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Get)('admin/findAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "findAllDepositForAdmin", null);
__decorate([
    (0, common_1.Patch)('/admin/depositAction/:depositId'),
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('depositId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "actionOnDeposit", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Get)('user/wallet'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "wallet", null);
exports.DepositController = DepositController = __decorate([
    (0, swagger_1.ApiTags)('Deposit Api'),
    (0, common_1.Controller)('deposit'),
    __metadata("design:paramtypes", [deposit_service_1.DepositService])
], DepositController);
//# sourceMappingURL=deposit.controller.js.map