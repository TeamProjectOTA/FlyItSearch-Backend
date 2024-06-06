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
exports.TourpackageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tourpackage_model_1 = require("./tourpackage.model");
const typeorm_2 = require("typeorm");
let TourpackageService = class TourpackageService {
    constructor(tourPacageRepository) {
        this.tourPacageRepository = tourPacageRepository;
    }
    async create(tourPackageDto, path) {
        const packageTitle = await this.tourPacageRepository.findOne({
            where: { title: tourPackageDto.title },
        });
        if (packageTitle) {
            throw new common_1.ConflictException('Title already existed');
        }
        const newPackage = new tourpackage_model_1.Tourpackage();
        newPackage.title = tourPackageDto.title;
        newPackage.category = tourPackageDto.category;
        newPackage.date = tourPackageDto.date;
        newPackage.description = tourPackageDto.description;
        newPackage.picture = path;
        const savedPackage = await this.tourPacageRepository.save(newPackage);
        if (!savedPackage) {
            throw new common_1.InternalServerErrorException('Failed to save tour package');
        }
        return savedPackage;
    }
    async findOne(title) {
        let packagefind = await this.tourPacageRepository.findOne({
            where: { title: title },
        });
        if (!packagefind) {
            throw new common_1.NotFoundException();
        }
        return packagefind;
    }
    async findAll(category) {
        return await this.tourPacageRepository.find({ where: { category } });
    }
};
exports.TourpackageService = TourpackageService;
exports.TourpackageService = TourpackageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tourpackage_model_1.Tourpackage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TourpackageService);
//# sourceMappingURL=tourpackage.service.js.map