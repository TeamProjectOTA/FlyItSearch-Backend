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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const uploads_service_1 = require("./uploads.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
const user_tokens_guard_1 = require("../auth/user-tokens.guard");
let UploadsController = class UploadsController {
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async uploadFile(header, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded or invalid file format.');
        }
        return await this.uploadsService.create(header, file);
    }
    async uploadVisaAndPassport(bookingId, files) {
        if (!files) {
            throw new common_1.BadRequestException('no file is given');
        }
        if (files.length !== 2) {
            throw new common_1.BadRequestException('Exactly two files (passport and visa) are required');
        }
        const passportFile = files[0];
        const visaFile = files[1];
        return this.uploadsService.uploadVisaAndPassportImages(bookingId, passportFile, visaFile);
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('profilePicture/'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = [
                'image/jpg',
                'image/png',
                'image/jpeg',
                'image/gif',
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('File type must be jpeg, jpg, png, gif'), false);
            }
        },
    })),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)(':bookingId/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 2)),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadVisaAndPassport", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiTags)('Uploads'),
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map