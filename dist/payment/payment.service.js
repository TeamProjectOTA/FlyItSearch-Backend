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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const sslcommerz_1 = require("sslcommerz");
const typeorm_2 = require("typeorm");
let PaymentService = class PaymentService {
    constructor(loginRepository) {
        this.loginRepository = loginRepository;
        this.storeId = process.env.STORE_ID;
        this.storePassword = process.env.STORE_PASSWORD;
        this.isLive = false;
    }
    async initiatePayment(passengerId) {
        const userData = await this.loginRepository.findOne({
            where: { passengerId: passengerId },
        });
        const sslcommerz = new sslcommerz_1.SslCommerzPayment(this.storeId, this.storePassword, this.isLive);
        const tran_id = Date.now().toString(36);
        const data = {
            total_amount: 100,
            currency: 'BDT',
            tran_id: tran_id,
            success_url: 'http://localhost:3000/payment/success',
            fail_url: 'http://localhost:3000/payment/fail',
            cancel_url: 'http://localhost:3000/payment/cancel',
            ipn_url: 'http://localhost:3000/ipn',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: userData.fullName,
            cus_email: userData.email,
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: '1000',
            ship_country: 'Bangladesh',
        };
        try {
            const apiResponse = await sslcommerz.init(data);
            return apiResponse.GatewayPageURL;
        }
        catch (error) {
            throw new Error('Failed to initiate payment');
        }
    }
    async validateOrder(val_id) {
        const sslcz = new sslcommerz_1.SslCommerzPayment(this.storeId, this.storePassword, this.isLive);
        const data = { val_id };
        try {
            const response = await sslcz.validate(data);
            return response;
        }
        catch (error) {
            throw new Error('Failed to validate order');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map