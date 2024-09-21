"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransectionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transection_model_1 = require("./transection.model");
const transection_service_1 = require("./transection.service");
const auth_module_1 = require("../auth/auth.module");
const booking_model_1 = require("../book/booking.model");
let TransectionModule = class TransectionModule {
};
exports.TransectionModule = TransectionModule;
exports.TransectionModule = TransectionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([transection_model_1.Transection, booking_model_1.BookingSave]), auth_module_1.AuthModule],
        providers: [transection_service_1.TransectionService],
        exports: [transection_service_1.TransectionService]
    })
], TransectionModule);
//# sourceMappingURL=transection.module.js.map