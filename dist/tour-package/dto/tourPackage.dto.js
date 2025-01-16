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
exports.CreateTourPackageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTourPlanDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the tour plan', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourPlanDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the tour plan', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourPlanDto.prototype, "plan", void 0);
class CreateIntroductionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Main title for the tour package', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "mainTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sub title for the tour package', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "subTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of the trip (e.g., adventure, leisure)', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "tripType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Journey duration (e.g., 5 days, 3 weeks)', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "journeyDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Journey start date', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "journeyStartDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Journey end date', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "journeyEndDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country name', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "countryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City name', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "cityName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Journey location (e.g., region)', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "journeyLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of seats available for the tour', default: '0' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "totalSeat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum age for the tour', default: '0' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "minimumAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum age for the tour', default: '0' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "maximumAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price of the package', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "packagePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Discount on the package (optional)', default: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "packageDiscount", void 0);
class CreateTourPackageDto {
}
exports.CreateTourPackageDto = CreateTourPackageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Package status', default: 'active' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Package type', default: 'standard' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "packageType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Overview details of the package',
        default: { packageOverView: '', packageInclude: [] },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTourPackageDto.prototype, "overView", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tour plan details',
        default: {},
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTourPackageDto.prototype, "tourPlan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Objective details (inclusion, exclusion, booking & refund policies)',
        default: { inclusion: {}, exclusion: {}, bookingPolicy: {}, refundPolicy: {} },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTourPackageDto.prototype, "objective", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meta information for the package (SEO)',
        default: { metaTitle: '', metaKeyword: [], metadescription: '' },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTourPackageDto.prototype, "metaInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Introduction information', type: CreateIntroductionDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", CreateIntroductionDto)
], CreateTourPackageDto.prototype, "introduction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tour plans related to the package', type: [CreateTourPlanDto] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTourPackageDto.prototype, "tourPlans", void 0);
//# sourceMappingURL=tourPackage.dto.js.map