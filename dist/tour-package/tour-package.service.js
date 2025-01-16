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
exports.TourPackageService = void 0;
const common_1 = require("@nestjs/common");
const tourPackage_model_1 = require("./entities/tourPackage.model");
const typeorm_1 = require("@nestjs/typeorm");
const Repository_1 = require("typeorm/repository/Repository");
const Introduction_model_1 = require("./entities/Introduction.model");
const tourPlan_Model_1 = require("./entities/tourPlan.Model");
let TourPackageService = class TourPackageService {
    constructor(tourPackageRepository, introductionRepository, tourPlanRepository) {
        this.tourPackageRepository = tourPackageRepository;
        this.introductionRepository = introductionRepository;
        this.tourPlanRepository = tourPlanRepository;
    }
    async create(createTourPackageDto) {
        const packageId = `PKG${Math.floor(Math.random() * 1000000)}`;
        const tourPackage = this.tourPackageRepository.create({
            packageId,
            ...createTourPackageDto,
        });
        const savedTourPackage = await this.tourPackageRepository.save(tourPackage);
        if (createTourPackageDto.introduction) {
            const introduction = this.introductionRepository.create({
                ...createTourPackageDto.introduction,
                tourPackage: savedTourPackage,
            });
            await this.introductionRepository.save(introduction);
        }
        if (createTourPackageDto.tourPlans && createTourPackageDto.tourPlans.length) {
            for (const plan of createTourPackageDto.tourPlans) {
                const tourPlan = this.tourPlanRepository.create({
                    ...plan,
                    tourPackage: savedTourPackage,
                });
                await this.tourPlanRepository.save(tourPlan);
            }
        }
        return savedTourPackage;
    }
    async findAll() {
        return this.tourPackageRepository.find({
            relations: ['introduction', 'tourPlans', 'mainImage', 'visitPlaceImage'],
        });
    }
};
exports.TourPackageService = TourPackageService;
exports.TourPackageService = TourPackageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tourPackage_model_1.TourPackage)),
    __param(1, (0, typeorm_1.InjectRepository)(Introduction_model_1.Introduction)),
    __param(2, (0, typeorm_1.InjectRepository)(tourPlan_Model_1.TourPlan)),
    __metadata("design:paramtypes", [Repository_1.Repository,
        Repository_1.Repository,
        Repository_1.Repository])
], TourPackageService);
//# sourceMappingURL=tour-package.service.js.map