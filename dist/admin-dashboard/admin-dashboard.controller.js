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
exports.AdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const admin_dashboard_service_1 = require("./admin-dashboard.service");
const swagger_1 = require("@nestjs/swagger");
let AdminDashboardController = class AdminDashboardController {
    constructor(adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }
    async findAllDeposit(date) {
        return await this.adminDashboardService.findAll(date);
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.Get)('allStateOfToday/:date'),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "findAllDeposit", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, swagger_1.ApiTags)('Admin-Dashboard'),
    (0, common_1.Controller)('adminDashboard'),
    __metadata("design:paramtypes", [admin_dashboard_service_1.AdminDashboardService])
], AdminDashboardController);
//# sourceMappingURL=admin-dashboard.controller.js.map