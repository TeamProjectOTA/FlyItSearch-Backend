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
exports.BankAddController = void 0;
const common_1 = require("@nestjs/common");
const bank_add_service_1 = require("./bank-add.service");
const bank_add_model_1 = require("./bank-add.model");
const swagger_1 = require("@nestjs/swagger");
const admin_tokens_guard_1 = require("../auth/admin.tokens.guard");
let BankAddController = class BankAddController {
    constructor(bankAddService) {
        this.bankAddService = bankAddService;
    }
    async create(createBankAddDto) {
        return this.bankAddService.create(createBankAddDto);
    }
    async getAll() {
        return this.bankAddService.getallBank();
    }
    async getAllaccount() {
        return this.bankAddService.getAllAccount();
    }
    async geOne(id) {
        return this.bankAddService.getOne(id);
    }
    async update(id, createBankAddDto) {
        return this.bankAddService.update(id, createBankAddDto);
    }
};
exports.BankAddController = BankAddController;
__decorate([
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_add_model_1.CreateBankAddDto]),
    __metadata("design:returntype", Promise)
], BankAddController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/allbank'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BankAddController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Get)('admin/allBank'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BankAddController.prototype, "getAllaccount", null);
__decorate([
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Get)('admin/oneBank/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BankAddController.prototype, "geOne", null);
__decorate([
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Patch)('admin/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, bank_add_model_1.CreateBankAddDto]),
    __metadata("design:returntype", Promise)
], BankAddController.prototype, "update", null);
exports.BankAddController = BankAddController = __decorate([
    (0, swagger_1.ApiTags)('AddBank'),
    (0, common_1.Controller)('bankAdd'),
    __metadata("design:paramtypes", [bank_add_service_1.BankAddService])
], BankAddController);
//# sourceMappingURL=bank-add.controller.js.map