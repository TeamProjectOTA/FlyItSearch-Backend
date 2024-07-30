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
var TourPackageController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourPackageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const tour_package_service_1 = require("./tour-package.service");
const create_tour_package_dto_1 = require("./dto/create-tour-package.dto");
const swagger_1 = require("@nestjs/swagger");
const multer_config_1 = require("./mutlar/multer.config");
let TourPackageController = TourPackageController_1 = class TourPackageController {
    constructor(tourPackageService) {
        this.tourPackageService = tourPackageService;
        this.logger = new common_1.Logger(TourPackageController_1.name);
    }
    async createIntroduction(createIntroductionDto) {
        return await this.tourPackageService.createIntorduction(createIntroductionDto);
    }
    async createOverview(createOverviewDto) {
        return await this.tourPackageService.createOverview(createOverviewDto);
    }
    async uploadPicturesmain(files) {
        const results = [];
        for (const file of files) {
            const savedPicture = await this.tourPackageService.createMainImage(file);
            results.push({
                id: savedPicture.id,
                name: savedPicture.mainTitle,
                path: savedPicture.path,
                size: savedPicture.size,
            });
        }
        return results;
    }
    async uploadPicturesVisit(files) {
        const results = [];
        for (const file of files) {
            const savedPicture = await this.tourPackageService.createVisitImage(file);
            results.push({
                id: savedPicture.id,
                path: savedPicture.path,
                size: savedPicture.size,
            });
        }
        return results;
    }
    async create(createTourPackageDtoArray) {
        const createdPackages = await Promise.all(createTourPackageDtoArray.map((dto) => this.tourPackageService.create(dto)));
        if (!createdPackages) {
            throw new common_1.NotAcceptableException();
        }
        return createdPackages;
    }
    async findAll(uuid) {
        const tourpackage = await this.tourPackageService.findAll(uuid);
        return tourpackage;
    }
    async delete(id) {
        return this.tourPackageService.delete(id);
    }
    async findAllByCriteria(mainTitle, countryName, cityName, metaKeywords, startDate) {
        const metaKeywordsArray = metaKeywords
            ? metaKeywords.split(',').map((keyword) => keyword.trim())
            : undefined;
        const criteria = {
            mainTitle,
            countryName,
            cityName,
            metaKeywords: metaKeywordsArray,
            startDate,
        };
        try {
            return await this.tourPackageService.findAllByCriteria(criteria);
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
    }
};
exports.TourPackageController = TourPackageController;
__decorate([
    (0, common_1.Post)('/introduction'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tour_package_dto_1.CreateIntroductionDto]),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "createIntroduction", null);
__decorate([
    (0, common_1.Post)('/overview'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tour_package_dto_1.CreateOverviewDto]),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "createOverview", null);
__decorate([
    (0, common_1.Post)('/mainImage'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, multer_config_1.multerConfig)),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "uploadPicturesmain", null);
__decorate([
    (0, common_1.Post)('/visitPlace'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, multer_config_1.multerConfig)),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "uploadPicturesVisit", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":uuid"),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('mainTitle')),
    __param(1, (0, common_1.Query)('countryName')),
    __param(2, (0, common_1.Query)('cityName')),
    __param(3, (0, common_1.Query)('metaKeywords')),
    __param(4, (0, common_1.Query)('startDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "findAllByCriteria", null);
exports.TourPackageController = TourPackageController = TourPackageController_1 = __decorate([
    (0, swagger_1.ApiTags)('Tour-Package'),
    (0, common_1.Controller)('tour-packages'),
    __metadata("design:paramtypes", [tour_package_service_1.TourPackageService])
], TourPackageController);
//# sourceMappingURL=tour-package.controller.js.map