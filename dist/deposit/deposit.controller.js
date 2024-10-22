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
const deposit_model_1 = require("./deposit.model");
const user_tokens_guard_1 = require("../auth/user-tokens.guard");
const swagger_1 = require("@nestjs/swagger");
const admin_tokens_guard_1 = require("../auth/admin.tokens.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
let DepositController = class DepositController {
    constructor(depositService) {
        this.depositService = depositService;
    }
    async createDeposit(file, depositData, header) {
        if (!file) {
            throw new common_1.BadRequestException('Receipt image is required');
        }
        try {
            return await this.depositService.createDeposit(depositData, header, file);
        }
        catch (error) {
            console.error('Error in createDeposit:', error.message);
            throw new common_1.InternalServerErrorException('Failed to create deposit');
        }
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
    async sslcommerz(header, depositDto) {
        return await this.depositService.sslcommerzPaymentInit(header, depositDto.amount);
    }
    async depositSuccessSSLCommerz(email, amount, req, res) {
        try {
            const { val_id } = req.body;
            const validationResponse = await this.depositService.validateOrder(val_id, email, amount);
            if (validationResponse?.status === 'VALID') {
                return res
                    .status(200)
                    .json({ message: 'Payment successful', validationResponse });
            }
            else {
                return res
                    .status(400)
                    .json({ message: 'Payment validation failed', validationResponse });
            }
        }
        catch (error) {
            console.error('Error during payment validation:', error);
            return res
                .status(500)
                .json({ message: 'Internal server error', error: error.message });
        }
    }
    async surjoPay(header, depositDto) {
        return await this.depositService.surjoPayInit(header, depositDto.amount);
    }
    async depositSuccessSurjoPay(email, amount, order_id) {
        const paymentData = await this.depositService.surjoVerifyPayment(order_id, email, amount);
        return {
            message: 'Payment successfull',
            data: paymentData,
        };
    }
    async bkash(header, depositDto) {
        return await this.depositService.createPaymentBkash(depositDto.amount, header);
    }
    async handlePaymentCallback(amount, email, paymentID, status, signature, res) {
        const result = await this.depositService.executePaymentBkash(paymentID, status, amount, res, email);
        return result;
    }
};
exports.DepositController = DepositController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('/createDeposit'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('receiptImage', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = [
                'image/jpg',
                'image/png',
                'image/jpeg',
                'image/gif',
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('File type must be jpeg, jpg, png, gif'), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
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
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('sslcommerz/deposit'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, deposit_model_1.DepositDto]),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "sslcommerz", null);
__decorate([
    (0, common_1.Post)('sslcommerz/success/:email/:amount'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('amount')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "depositSuccessSSLCommerz", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('surjo/deposit'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, deposit_model_1.DepositDto]),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "surjoPay", null);
__decorate([
    (0, common_1.Get)('surjo/success/:email/:amount'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('amount')),
    __param(2, (0, common_1.Query)('order_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "depositSuccessSurjoPay", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('bkash/deposit'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, deposit_model_1.DepositDto]),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "bkash", null);
__decorate([
    (0, common_1.Get)('bkash/callback/:email/:amount'),
    __param(0, (0, common_1.Param)('amount')),
    __param(1, (0, common_1.Param)('email')),
    __param(2, (0, common_1.Query)('paymentID')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('signature')),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], DepositController.prototype, "handlePaymentCallback", null);
exports.DepositController = DepositController = __decorate([
    (0, swagger_1.ApiTags)('Deposit Api'),
    (0, common_1.Controller)('deposit'),
    __metadata("design:paramtypes", [deposit_service_1.DepositService])
], DepositController);
//# sourceMappingURL=deposit.controller.js.map