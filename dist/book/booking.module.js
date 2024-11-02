"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const typeorm_1 = require("@nestjs/typeorm");
const booking_model_1 = require("./booking.model");
const flight_module_1 = require("../flight/flight.module");
const admin_entity_1 = require("../admin/entities/admin.entity");
const user_module_1 = require("../user/user.module");
const user_entity_1 = require("../user/entities/user.entity");
const auth_module_1 = require("../auth/auth.module");
const booking_controller_1 = require("./booking.controller");
const flight_model_1 = require("../flight/flight.model");
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([admin_entity_1.Admin, user_entity_1.User, booking_model_1.BookingSave, flight_model_1.BookingIdSave]),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            flight_module_1.FlightModule,
        ],
        controllers: [booking_controller_1.BookingController],
        providers: [booking_service_1.BookingService],
        exports: [booking_service_1.BookingService],
    })
], BookingModule);
//# sourceMappingURL=booking.module.js.map