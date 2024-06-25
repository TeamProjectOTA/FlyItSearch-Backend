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
const typeorm_2 = require("typeorm");
const tour_package_entity_1 = require("./entities/tour-package.entity");
const Introduction_model_1 = require("./entities/Introduction.model");
const overview_model_1 = require("./entities/overview.model");
const mainImage_model_1 = require("./entities/mainImage.model");
const visitPlace_model_1 = require("./entities/visitPlace.model");
let TourPackageService = class TourPackageService {
    constructor(tourPackageRepository, introductionRepository, overviewRepository, mainImageRepository, visitPlaceRepository) {
        this.tourPackageRepository = tourPackageRepository;
        this.introductionRepository = introductionRepository;
        this.overviewRepository = overviewRepository;
        this.mainImageRepository = mainImageRepository;
        this.visitPlaceRepository = visitPlaceRepository;
    }
    async createIntorduction(createIntroductionDto) {
        const add2 = await this.introductionRepository.findOne({
            where: { mainTitle: createIntroductionDto.mainTitle },
        });
        if (add2) {
            throw new common_1.ConflictException('The title is invalid');
        }
        const add = new Introduction_model_1.Introduction();
        add.mainTitle = createIntroductionDto.mainTitle;
        add.subTitle = createIntroductionDto.subTitle;
        add.tripType = createIntroductionDto.tripType;
        add.journeyDuration = createIntroductionDto.journeyDuration;
        add.startDate = createIntroductionDto.startDate;
        add.endDate = createIntroductionDto.endDate;
        add.countryName = createIntroductionDto.countryName;
        add.cityName = createIntroductionDto.cityName;
        add.journeyLocation = createIntroductionDto.journeyLocation;
        add.totalSeat = createIntroductionDto.totalSeat;
        add.minimumAge = createIntroductionDto.minimumAge;
        add.maximumAge = createIntroductionDto.maximumAge;
        add.packagePrice = createIntroductionDto.packagePrice;
        add.packageDiscount = createIntroductionDto.packageDiscount;
        return await this.introductionRepository.save(add);
    }
    async createOverview(createOverviewDto) {
        const add = new overview_model_1.Overview();
        add.packageOverview = createOverviewDto.packageOverview;
        add.packageInclude = createOverviewDto.packageInclude;
        return this.overviewRepository.save(add);
    }
    async createMainImage(file) {
        if (!file) {
            throw new common_1.NotFoundException('No picture file found');
        }
        if (!file.filename || !file.path || file.size === undefined) {
            throw new common_1.NotAcceptableException('Invalid file data');
        }
        const picture = new mainImage_model_1.MainImage();
        picture.mainTitle = file.filename;
        picture.path = file.path;
        picture.size = file.size;
        try {
            return await this.mainImageRepository.save(picture);
        }
        catch (error) {
            throw new Error('Failed to save main image');
        }
    }
    async createVisitImage(file) {
        if (!file) {
            throw new common_1.NotFoundException('No picture file found');
        }
        if (!file.filename || !file.path || file.size === undefined) {
            throw new common_1.NotAcceptableException('Invalid file data');
        }
        const picture = new visitPlace_model_1.VisitPlace();
        picture.pictureName = file.filename;
        picture.path = file.path;
        picture.size = file.size;
        try {
            return await this.visitPlaceRepository.save(picture);
        }
        catch (error) {
            throw new Error('Failed to save main image');
        }
    }
    async create(createTourPackageDto) {
        const { introduction } = createTourPackageDto;
        const existingIntroduction = await this.introductionRepository.findOne({
            where: { mainTitle: introduction.mainTitle },
        });
        if (existingIntroduction) {
            throw new common_1.ConflictException('Introduction with the same mainTitle already exists');
        }
        const tourPackage = this.tourPackageRepository.create(createTourPackageDto);
        return this.tourPackageRepository.save(tourPackage);
    }
    async findAll() {
        const tourPackages = await this.tourPackageRepository.find({
            relations: [
                'introduction',
                'overview',
                'mainImage',
                'visitPlace',
                'tourPlan',
                'objectives',
                'metaInfo',
            ],
        });
        return tourPackages;
    }
    async delete(id) {
        const result = await this.tourPackageRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`TourPackage with ID "${id}" not found`);
        }
    }
    async findAllByCriteria(criteria) {
        const { mainTitle, countryName, cityName, metaKeywords, startDate } = criteria;
        let query = this.tourPackageRepository
            .createQueryBuilder('tourPackage')
            .leftJoinAndSelect('tourPackage.introduction', 'introduction')
            .leftJoinAndSelect('tourPackage.overview', 'overview')
            .leftJoinAndSelect('tourPackage.mainImage', 'mainImage')
            .leftJoinAndSelect('tourPackage.visitPlace', 'visitPlace')
            .leftJoinAndSelect('tourPackage.tourPlan', 'tourPlan')
            .leftJoinAndSelect('tourPackage.objectives', 'objectives')
            .leftJoinAndSelect('tourPackage.metaInfo', 'metaInfo');
        const whereConditions = [];
        const parameters = {};
        if (mainTitle) {
            whereConditions.push('introduction.mainTitle = :mainTitle');
            parameters.mainTitle = mainTitle;
        }
        if (countryName) {
            whereConditions.push('introduction.countryName = :countryName');
            parameters.countryName = countryName;
        }
        if (cityName) {
            whereConditions.push('introduction.cityName = :cityName');
            parameters.cityName = cityName;
        }
        if (startDate) {
            whereConditions.push('introduction.startDate = :startDate');
            parameters.startDate = startDate;
        }
        if (metaKeywords && metaKeywords.length > 0) {
            const keywordConditions = metaKeywords.map((keyword, index) => {
                return `FIND_IN_SET(:keyword${index}, metaInfo.metaKeywords)`;
            });
            whereConditions.push(`(${keywordConditions.join(' OR ')})`);
            metaKeywords.forEach((keyword, index) => {
                parameters[`keyword${index}`] = keyword.trim();
            });
        }
        if (whereConditions.length > 0) {
            query = query.where(whereConditions.join(' AND '), parameters);
        }
        else {
            throw new common_1.NotFoundException('No search criteria provided');
        }
        const tourPackages = await query.getMany();
        if (tourPackages.length === 0) {
            throw new common_1.NotFoundException('Tour packages not found');
        }
        return tourPackages;
    }
};
exports.TourPackageService = TourPackageService;
exports.TourPackageService = TourPackageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tour_package_entity_1.TourPackage)),
    __param(1, (0, typeorm_1.InjectRepository)(Introduction_model_1.Introduction)),
    __param(2, (0, typeorm_1.InjectRepository)(overview_model_1.Overview)),
    __param(3, (0, typeorm_1.InjectRepository)(mainImage_model_1.MainImage)),
    __param(4, (0, typeorm_1.InjectRepository)(visitPlace_model_1.VisitPlace)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TourPackageService);
//# sourceMappingURL=tour-package.service.js.map