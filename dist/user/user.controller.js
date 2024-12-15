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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const user_tokens_guard_1 = require("../auth/user-tokens.guard");
const admin_tokens_guard_1 = require("../auth/admin.tokens.guard");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    update(header, updateUserDto) {
        return this.userService.update(header, updateUserDto);
    }
    findAllUser(header, page, limit) {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        return this.userService.allUser(header, pageNumber, limitNumber);
    }
    async findUserWithBookings(header, bookingStatus, page, limit) {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        return this.userService.findUserWithBookings(header, bookingStatus, pageNumber, limitNumber);
    }
    async findAllUserWithBookings(page = 1, limit = 10) {
        return this.userService.findAllUserWithBookings(page, limit);
    }
    async findOneUser(header) {
        return this.userService.findOneUser(header);
    }
    async getUserTravelBuddies(header, page, limit) {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const travelBuddies = await this.userService.findUserTravelBuddy(header, pageNumber, limitNumber);
        return travelBuddies;
    }
    async findOneUserTransection(header, page, limit) {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        return await this.userService.findUserTransactions(header, pageNumber, limitNumber);
    }
    async findAllUserTransection(page, limit) {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        return await this.userService.allTransection(pageNumber, limitNumber);
    }
    async updateUserActivation(email, action) {
        return await this.userService.updateUserActivation(email, action);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('/signUp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Patch)('/updateUserProfile'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Get)('/admin/allUser'),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAllUser", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Get)('/bookings/:bookingStatus'),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingStatus')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserWithBookings", null);
__decorate([
    (0, common_1.Get)('allUserBookings'),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllUserWithBookings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Get)('/profileInfo'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOneUser", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Get)('/findAllTravelBuddy'),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserTravelBuddies", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Get)('/oneUserAllTransection'),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOneUserTransection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, common_1.Get)('admin/ledgerReport'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllUserTransection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Patch)('admin/userAccountAction'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserActivation", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map