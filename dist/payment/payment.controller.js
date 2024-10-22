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
    async handleSuccess(bookingId, email, req, res) {
        try {
            const { val_id } = req.body;
            const response = await this.paymentService.validateOrder(val_id, bookingId, email);
            if (response.status === 'VALID') {
                res.status(common_1.HttpStatus.OK).json({
                    message: 'Payment was successful.',
                    details: response,
                });
            }
            else {
                res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    message: 'Payment validation failed.',
                    details: response,
                });
            }
        }
        catch (error) {
            console.error('Error handling success:', error);
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to validate payment.',
                error: error.message,
            });
        }
    }
    handleFail(res) {
        res.status(common_1.HttpStatus.BAD_REQUEST).json({
            message: 'Payment failed.',
        });
    }
    handleCancel(res) {
        res.status(common_1.HttpStatus.BAD_REQUEST).json({
            message: 'Payment was cancelled.',
        });
    }
    async handleIPN(req, res) {
        try {
            const ipnData = req.body;
            console.log('IPN Data:', ipnData);
            const response = await this.paymentService.validateOrder(ipnData.tran_id);
            if (response.status === 'VALID') {
                res.status(common_1.HttpStatus.OK).send('IPN received and processed');
            }
            else {
                res.status(common_1.HttpStatus.BAD_REQUEST).send('IPN validation failed');
            }
        }
        catch (error) {
            console.error('Error handling IPN:', error);
            res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .send('IPN processing failed');
        }
    }
    async handlePaymentCallback(bookingId, email, paymentID, status, signature, res) {
        const result = await this.paymentService.executePaymentBkash(paymentID, status, bookingId, res, email);
        return result;
    }
    async paymentReturn(bookingID, email, order_id) {
        const paymentData = await this.paymentService.surjoVerifyPayment(order_id, bookingID, email);
        return {
            message: 'Payment successfull',
            data: paymentData,
        };
    }
    async createPayment(amount, header, bookingId) {
        return this.paymentService.createPaymentBkash(amount, bookingId, header);
    }
    async queryPayment(paymentId) {
        return this.paymentService.queryPayment(paymentId);
    }
    async searchTransaction(transactionId) {
        return this.paymentService.searchTransaction(transactionId);
    }
    async refundTransaction(paymentId, amount) {
        return this.paymentService.refundTransaction(paymentId, amount);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('/success/:bookingId/:email'),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Param)('email')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
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
    (0, common_1.Get)('/cancel'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "handleCancel", null);
__decorate([
    (0, common_1.Post)('/ipn'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleIPN", null);
__decorate([
    (0, common_1.Get)('callback/:bookingId/:email'),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Param)('email')),
    __param(2, (0, common_1.Query)('paymentID')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('signature')),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handlePaymentCallback", null);
__decorate([
    (0, common_1.Get)('return/:bookingID/:email'),
    __param(0, (0, common_1.Param)('bookingID')),
    __param(1, (0, common_1.Param)('email')),
    __param(2, (0, common_1.Query)('order_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "paymentReturn", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('bkashCreate/:amount/:bookingId'),
    __param(0, (0, common_1.Param)('amount')),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)('query/:paymentId'),
    __param(0, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "queryPayment", null);
__decorate([
    (0, common_1.Post)('search/:transactionId'),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "searchTransaction", null);
__decorate([
    (0, common_1.Post)('refund'),
    __param(0, (0, common_1.Body)('paymentId')),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "refundTransaction", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('SSLCOMMERZ'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map