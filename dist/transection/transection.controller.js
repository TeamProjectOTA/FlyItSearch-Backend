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
exports.TransectionController = void 0;
const common_1 = require("@nestjs/common");
const transection_service_1 = require("./transection.service");
const transection_model_1 = require("./transection.model");
const swagger_1 = require("@nestjs/swagger");
const user_tokens_guard_1 = require("../auth/user-tokens.guard");
let TransectionController = class TransectionController {
    constructor(TranserctionService) {
        this.TranserctionService = TranserctionService;
    }
    async walletTransection(header, transectionDto) {
        return await this.TranserctionService.paymentWithWallet(header, transectionDto);
    }
};
exports.TransectionController = TransectionController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('Wallet'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, transection_model_1.CreateTransectionDto]),
    __metadata("design:returntype", Promise)
], TransectionController.prototype, "walletTransection", null);
exports.TransectionController = TransectionController = __decorate([
    (0, swagger_1.ApiTags)('WallletTransection'),
    (0, common_1.Controller)('WalletTransection'),
    __metadata("design:paramtypes", [transection_service_1.TransectionService])
], TransectionController);
//# sourceMappingURL=transection.controller.js.map