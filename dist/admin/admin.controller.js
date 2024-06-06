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
    create(createAdminDto) {
        return this.adminService.create(createAdminDto);
    }
    findOne(header, adminId) {
        return this.adminService.findOne(header, adminId);
    }
    update(header, adminId, updateAdminDto) {
        return this.adminService.update(header, adminId, updateAdminDto);
    }
    remove(header, adminId) {
        return this.adminService.remove(header, adminId);
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
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)(':adminId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':adminId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('adminId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_admin_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':adminId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/user/:passengerId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('passengerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findUser", null);
__decorate([
    (0, common_1.Delete)('/user/:passengerId'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('passengerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "removeuser", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map