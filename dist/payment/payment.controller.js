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
            return { url: redirectUrl, statusCode: 301 };
        }
        catch (error) {
            return { message: 'Failed to initiate payment' };
        }
    }
    async validateOrder(val_id) {
        try {
            const response = await this.paymentService.validateOrder(val_id);
            return { data: response };
        }
        catch (error) {
            return { message: 'Failed to validate order' };
        }
    }
    redirectSuccess(res) {
        const successMessage = 'The payment was successful.';
        res.status(common_1.HttpStatus.OK).send(successMessage);
    }
    redirectFail(res) {
        const message = ' The payment was not done';
        res.status(common_1.HttpStatus.OK).send(message);
    }
    redirectCancel(res) {
        const message = 'The payment was canceled';
        res.status(common_1.HttpStatus.OK).send(message);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Get)('/:passengerId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('passengerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentUrl", null);
__decorate([
    (0, common_1.Get)('/payment/validate/'),
    __param(0, (0, common_1.Query)('val_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "validateOrder", null);
__decorate([
    (0, common_1.Post)('/success'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "redirectSuccess", null);
__decorate([
    (0, common_1.Post)('/fail'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "redirectFail", null);
__decorate([
    (0, common_1.Post)('/cancel'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "redirectCancel", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('SSLCOMMERZ'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map