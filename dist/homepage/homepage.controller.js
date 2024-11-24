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
exports.HomepageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const homepage_service_1 = require("./homepage.service");
const platform_express_1 = require("@nestjs/platform-express");
const admin_tokens_guard_1 = require("../auth/admin.tokens.guard");
let HomepageController = class HomepageController {
    constructor(homePageService) {
        this.homePageService = homePageService;
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024;
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPEG and PNG are allowed.');
        }
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size exceeds the maximum limit of 5MB.');
        }
        return this.homePageService.uploadImage(file);
    }
};
exports.HomepageController = HomepageController;
__decorate([
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Post)('/uploadDocuments'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HomepageController.prototype, "uploadImage", null);
exports.HomepageController = HomepageController = __decorate([
    (0, swagger_1.ApiTags)('Homepage-Api'),
    (0, common_1.Controller)('homepage'),
    __metadata("design:paramtypes", [homepage_service_1.HomepageService])
], HomepageController);
//# sourceMappingURL=homepage.controller.js.map