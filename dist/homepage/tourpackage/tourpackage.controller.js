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
exports.TourpackageController = void 0;
const common_1 = require("@nestjs/common");
const tourpackage_service_1 = require("./tourpackage.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const tourpackage_model_1 = require("./tourpackage.model");
const swagger_1 = require("@nestjs/swagger");
let TourpackageController = class TourpackageController {
    constructor(tourpackageService) {
        this.tourpackageService = tourpackageService;
    }
    async create(tourpackageDto, file) {
        return this.tourpackageService.create(tourpackageDto, file.filename);
    }
    findAll(category) {
        return this.tourpackageService.findAll(category);
    }
};
exports.TourpackageController = TourpackageController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', {
        storage: (0, multer_1.diskStorage)({
            destination: './src/AllFile/HotDeals',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tourpackage_model_1.TourpackageDto, Object]),
    __metadata("design:returntype", Promise)
], TourpackageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/:category'),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TourpackageController.prototype, "findAll", null);
exports.TourpackageController = TourpackageController = __decorate([
    (0, swagger_1.ApiTags)('Hotdeals-Api'),
    (0, common_1.Controller)('hotdeals'),
    __metadata("design:paramtypes", [tourpackage_service_1.TourpackageService])
], TourpackageController);
//# sourceMappingURL=tourpackage.controller.js.map