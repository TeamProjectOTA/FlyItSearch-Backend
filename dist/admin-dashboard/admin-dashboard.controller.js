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
const admin_tokens_guard_1 = require("../auth/admin.tokens.guard");
const admin_dashboard_model_1 = require("./admin-dashboard.model");
let AdminDashboardController = class AdminDashboardController {
    constructor(adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }
    async findAllDeposit(startDate, endDate) {
        return await this.adminDashboardService.findAll(startDate, endDate);
    }
    async createTicket(ticketDataDTO) {
        return this.adminDashboardService.vendorMakeTicket(ticketDataDTO);
    }
    async getAllTickets() {
        return await this.adminDashboardService.findAllTickets();
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Get)('allStateOfRange'),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        type: 'string',
        required: true,
        example: '2024-01-01',
        description: 'The start date in YYYY-MM-DD format',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        type: 'string',
        required: true,
        example: '2024-01-31',
        description: 'The end date in YYYY-MM-DD format',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "findAllDeposit", null);
__decorate([
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Post)('VendorTicket'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dashboard_model_1.vendorTicket]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "createTicket", null);
__decorate([
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getAllTickets", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, swagger_1.ApiTags)('Admin-Dashboard'),
    (0, common_1.Controller)('adminDashboard'),
    __metadata("design:paramtypes", [admin_dashboard_service_1.AdminDashboardService])
], AdminDashboardController);
//# sourceMappingURL=admin-dashboard.controller.js.map