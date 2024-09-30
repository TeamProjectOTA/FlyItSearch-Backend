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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const update_admin_dto_1 = require("./dto/update-admin.dto");
const swagger_1 = require("@nestjs/swagger");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    create(createAdminDto, header) {
        return this.adminService.create(createAdminDto, header);
    }
    findOne(header, uuid) {
        return this.adminService.findOne(header, uuid);
    }
    async update(header, updateAdminDto, uuid) {
        return await this.adminService.update(header, updateAdminDto, uuid);
    }
    remove(header, uuid) {
        return this.adminService.remove(header, uuid);
    }
    findAll(header) {
        return this.adminService.findAll(header);
    }
    findUser(header, passengerId) {
        return this.adminService.findOneUser(passengerId, header);
    }
    removeuser(header, passengerId) {
        return this.adminService.removeUser(passengerId, header);
    }
    async allBooking(header, bookingId, reason) {
        return this.adminService.ticketCancel(bookingId, reason, header);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)(':uuid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Patch)(':uuid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_admin_dto_1.UpdateAdminDto, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Delete)(':uuid'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('/user/:passengerId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('passengerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findUser", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Delete)('/user/:passengerId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('passengerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "removeuser", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('/cancelTicket/:bookingId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "allBooking", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map