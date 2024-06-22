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
exports.TourPackageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const tour_package_service_1 = require("./tour-package.service");
const create_tour_package_dto_1 = require("./dto/create-tour-package.dto");
const multer_1 = require("multer");
const path_1 = require("path");
let TourPackageController = class TourPackageController {
    constructor(tourPackageService) {
        this.tourPackageService = tourPackageService;
    }
    async create(createTourPackageDto, files) {
        const images = files.map(file => ({
            path: `/uploads/${file.filename}`,
            size: file.size,
            description: '',
            mainTitle: '',
        }));
        createTourPackageDto.mainImage = images.filter((_, index) => index < createTourPackageDto.mainImage.length);
        createTourPackageDto.visitPlace.forEach((visitPlace, index) => {
            if (images[createTourPackageDto.mainImage.length + index]) {
                visitPlace.path = images[createTourPackageDto.mainImage.length + index].path;
                visitPlace.size = images[createTourPackageDto.mainImage.length + index].size;
            }
        });
        return this.tourPackageService.create(createTourPackageDto);
    }
    async findAll() {
        return this.tourPackageService.findAll();
    }
};
exports.TourPackageController = TourPackageController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 20, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tour_package_dto_1.CreateTourPackageDto, Array]),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "findAll", null);
exports.TourPackageController = TourPackageController = __decorate([
    (0, common_1.Controller)('tour-packages'),
    __metadata("design:paramtypes", [tour_package_service_1.TourPackageService])
], TourPackageController);
//# sourceMappingURL=tour-package.controller.js.map