"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardModule = void 0;
const common_1 = require("@nestjs/common");
const admin_dashboard_service_1 = require("./admin-dashboard.service");
const admin_dashboard_controller_1 = require("./admin-dashboard.controller");
const typeorm_1 = require("@nestjs/typeorm");
const booking_model_1 = require("../book/booking.model");
const deposit_model_1 = require("../deposit/deposit.model");
const auth_module_1 = require("../auth/auth.module");
const admin_dashboard_model_1 = require("./admin-dashboard.model");
let AdminDashboardModule = class AdminDashboardModule {
};
exports.AdminDashboardModule = AdminDashboardModule;
exports.AdminDashboardModule = AdminDashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([booking_model_1.BookingSave, deposit_model_1.Deposit, admin_dashboard_model_1.NewTicket]),
            auth_module_1.AuthModule,
        ],
        controllers: [admin_dashboard_controller_1.AdminDashboardController],
        providers: [admin_dashboard_service_1.AdminDashboardService],
    })
], AdminDashboardModule);
//# sourceMappingURL=admin-dashboard.module.js.map