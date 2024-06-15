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
const typeorm_1 = require("@nestjs/typeorm");
const tour_package_entity_1 = require("./entities/tour-package.entity");
const typeorm_2 = require("typeorm");
let TourPackageService = class TourPackageService {
    constructor(tourPackageRepository) {
        this.tourPackageRepository = tourPackageRepository;
    }
    async create(createTourPackageDto) {
        const tourPackage = new tour_package_entity_1.TourPackage();
        tourPackage.mainTitle = createTourPackageDto.mainTitle;
        tourPackage.subTitle = createTourPackageDto.subTitle;
        tourPackage.tripType = createTourPackageDto.tripType;
        tourPackage.journeyDuration = createTourPackageDto.journeyDuration;
        const startDate = new Date(createTourPackageDto.startDate);
        const endDate = new Date(createTourPackageDto.endDate);
        tourPackage.startDate = `${this.formatDate(startDate)} (${this.getDayOfWeek(startDate)})`;
        tourPackage.endDate = `${this.formatDate(endDate)} (${this.getDayOfWeek(endDate)})`;
        tourPackage.countryName = createTourPackageDto.countryName;
        tourPackage.cityName = createTourPackageDto.cityName;
        tourPackage.journeyLocation = createTourPackageDto.journeyLocation;
        tourPackage.totalSeat = createTourPackageDto.totalSeat;
        tourPackage.maximunAge = createTourPackageDto.maximunAge;
        tourPackage.minimumAge = createTourPackageDto.minimumAge;
        tourPackage.packagePrice = createTourPackageDto.packagePrice;
        tourPackage.packageDiscount = createTourPackageDto.packageDiscount;
        tourPackage.packageOverview = createTourPackageDto.packageOverview;
        return this.tourPackageRepository.save(tourPackage);
    }
    getDayOfWeek(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getUTCDay()];
    }
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    findAll() {
        return `This action returns all tourPackage`;
    }
    findOne(id) {
        return `This action returns a #${id} tourPackage`;
    }
    update(id, updateTourPackageDto) {
        return `This action updates a #${id} tourPackage`;
    }
    remove(id) {
        return `This action removes a #${id} tourPackage`;
    }
};
exports.TourPackageService = TourPackageService;
exports.TourPackageService = TourPackageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tour_package_entity_1.TourPackage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TourPackageService);
//# sourceMappingURL=tour-package.service.js.map