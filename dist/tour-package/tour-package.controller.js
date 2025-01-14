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
const swagger_1 = require("@nestjs/swagger");
const tourPackage_model_1 = require("./entities/tourPackage.model");
const tour_package_service_1 = require("./tour-package.service");
const tourPackage_dto_1 = require("./dto/tourPackage.dto");
let TourPackageController = class TourPackageController {
    constructor(tourPackageService) {
        this.tourPackageService = tourPackageService;
    }
    async create(createTourPackageDto) {
        return this.tourPackageService.create(createTourPackageDto);
    }
};
exports.TourPackageController = TourPackageController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tour package' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The tour package has been successfully created.',
        type: tourPackage_model_1.TourPackage,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid data provided.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tourPackage_dto_1.CreateTourPackageDto]),
    __metadata("design:returntype", Promise)
], TourPackageController.prototype, "create", null);
exports.TourPackageController = TourPackageController = __decorate([
    (0, swagger_1.ApiTags)('Tour-Package'),
    (0, common_1.Controller)('tour-packages'),
    __metadata("design:paramtypes", [tour_package_service_1.TourPackageService])
], TourPackageController);
//# sourceMappingURL=tour-package.controller.js.map