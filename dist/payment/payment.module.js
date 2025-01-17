"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_controller_1 = require("./payment.controller");
const payment_service_1 = require("./payment.service");
const typeorm_1 = require("@nestjs/typeorm");
const booking_model_1 = require("../book/booking.model");
const transection_model_1 = require("../transection/transection.model");
const transection_module_1 = require("../transection/transection.module");
const user_entity_1 = require("../user/entities/user.entity");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const deposit_model_1 = require("../deposit/deposit.model");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([booking_model_1.BookingSave, transection_model_1.Transection, user_entity_1.User, deposit_model_1.Wallet]),
            transection_module_1.TransectionModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map