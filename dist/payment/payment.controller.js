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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const swagger_1 = require("@nestjs/swagger");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async getPaymentUrl(res, passengerId) {
        try {
            const redirectUrl = await this.paymentService.initiatePayment(passengerId);
            res.status(common_1.HttpStatus.OK).json({ url: redirectUrl });
        }
        catch (error) {
            console.error('Failed to initiate payment:', error);
            throw new common_1.HttpException('Failed to initiate payment', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateOrder(val_id) {
        try {
            const response = await this.paymentService.validateOrder(val_id);
            return { data: response };
        }
        catch (error) {
            console.error('Failed to validate order:', error);
            throw new common_1.HttpException('Failed to validate order', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleSuccess(val_id, res) {
        try {
            const response = await this.paymentService.validateOrder(val_id);
            const successMessage = {
                message: 'The payment was successful.',
                data: response,
                status: common_1.HttpStatus.OK,
            };
            res.status(common_1.HttpStatus.OK).json(successMessage);
        }
        catch (error) {
            console.error('Success handling error:', error);
            throw new common_1.HttpException('Failed to validate order', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    handleFail(res) {
        const failMessage = {
            message: 'The payment was not successful.',
            status: common_1.HttpStatus.OK,
        };
        res.status(common_1.HttpStatus.OK).json(failMessage);
    }
    handleCancel(res) {
        const cancelMessage = {
            message: 'The payment was canceled.',
            status: common_1.HttpStatus.OK,
        };
        res.status(common_1.HttpStatus.OK).json(cancelMessage);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Get)('/:passengerId'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('passengerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentUrl", null);
__decorate([
    (0, common_1.Get)('/payment/validate'),
    __param(0, (0, common_1.Query)('val_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "validateOrder", null);
__decorate([
    (0, common_1.Post)('/success'),
    __param(0, (0, common_1.Query)('val_id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleSuccess", null);
__decorate([
    (0, common_1.Post)('/fail'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "handleFail", null);
__decorate([
    (0, common_1.Post)('/cancel'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "handleCancel", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('SSLCOMMERZ'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map