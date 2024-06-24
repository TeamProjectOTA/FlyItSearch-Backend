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
        if (!userData) {
            throw new common_1.NotFoundException(`User with passengerId ${passengerId} not found`);
        }
        const sslcommerz = new sslcommerz_1.SslCommerzPayment(this.storeId, this.storePassword, this.isLive);
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const tran_id = `${timestamp}_${randomNumber}`;
        const data = {
            total_amount: 100,
            currency: 'BDT',
            tran_id: tran_id,
            success_url: 'http://localhost:3000/payment/success',
            fail_url: 'http://localhost:3000/payment/fail',
            cancel_url: 'http://localhost:3000/payment/cancel',
            shipping_method: 'NO',
            product_name: 'Air Ticket',
            product_category: 'air ticket',
            product_profile: 'airline-tickets',
            hours_till_departure: '24 hrs',
            flight_type: 'Oneway',
            pnr: 'Q123h4',
            journey_from_to: 'DAC-CGP',
            third_party_booking: 'No',
            cus_name: userData.fullName,
            cus_email: userData.email,
            cus_city: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: userData.phone,
        };
        try {
            const apiResponse = await sslcommerz.init(data);
            if (!apiResponse.GatewayPageURL) {
                throw new common_1.HttpException('Failed to get payment URL', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return apiResponse.GatewayPageURL;
        }
        catch (error) {
            console.error('Payment initiation error:', error);
            throw new common_1.HttpException('Failed to initiate payment', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateOrder(val_id) {
        const sslcz = new sslcommerz_1.SslCommerzPayment(this.storeId, this.storePassword, this.isLive);
        try {
            const response = await sslcz.validate({ val_id });
            if (response.status === 'VALID') {
                return response;
            }
            else if (response.status === 'INVALID_TRANSACTION') {
                console.error('Invalid transaction:', response);
                throw new common_1.HttpException('Invalid transaction', common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                console.error('Unknown validation error:', response);
                throw new common_1.HttpException('Failed to validate order', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        catch (error) {
            console.error('Order validation error:', error);
            throw new common_1.HttpException('Failed to validate order', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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