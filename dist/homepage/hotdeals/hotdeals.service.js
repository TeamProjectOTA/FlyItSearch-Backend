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
exports.HotDealsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hotdeals_model_1 = require("./hotdeals.model");
let HotDealsService = class HotDealsService {
    constructor(tourPacageRepository) {
        this.tourPacageRepository = tourPacageRepository;
    }
    async create(tourPackageDto, paths, fileDetails) {
        const packageTitle = await this.tourPacageRepository.findOne({
            where: { title: tourPackageDto.title },
        });
        if (packageTitle) {
            throw new common_1.ConflictException('Title already existed');
        }
        const newPackage = new hotdeals_model_1.HotDeals();
        newPackage.title = tourPackageDto.title;
        newPackage.category = tourPackageDto.category;
        newPackage.date = tourPackageDto.date;
        newPackage.description = tourPackageDto.description;
        newPackage.pictureName = JSON.stringify(paths);
        newPackage.path = fileDetails[0].path;
        newPackage.size = fileDetails[0].size;
        const savedPackage = await this.tourPacageRepository.save(newPackage);
        if (!savedPackage) {
            throw new common_1.InternalServerErrorException('Failed to save tour package');
        }
        return savedPackage;
    }
    async findOne(category) {
        let packagefind = await this.tourPacageRepository.find({
            where: { category },
        });
        if (!packagefind) {
            throw new common_1.NotFoundException(`No ${category} avilable at the moment`);
        }
        if (category == 'all') {
            return await this.tourPacageRepository.find();
        }
        else {
            return packagefind;
        }
    }
    async Delete(title) {
        const findDeals = await this.tourPacageRepository.findOne({
            where: { title: title },
        });
        const deleteDeals = await this.tourPacageRepository.delete({
            title: title,
        });
        return { findDeals, deleteDeals };
    }
};
exports.HotDealsService = HotDealsService;
exports.HotDealsService = HotDealsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hotdeals_model_1.HotDeals)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HotDealsService);
//# sourceMappingURL=hotdeals.service.js.map