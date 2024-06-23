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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourPackageController = void 0;
const common_1 = require("@nestjs/common");
const tour_package_service_1 = require("./tour-package.service");
let TourPackageController = class TourPackageController {
    constructor(tourPackageService) {
        this.tourPackageService = tourPackageService;
    }
    async findAll() {
        return this.tourPackageService.findAll();
    }
};
exports.TourPackageController = TourPackageController;
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