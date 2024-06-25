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
exports.CreateTourPackageDto = exports.CreateMetaInfoDto = exports.CreateObjectivesDto = exports.CreateTourPlanDto = exports.CreateVisitPlaceDto = exports.CreateMainImageDto = exports.CreateOverviewDto = exports.CreateIntroductionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const class_validator_2 = require("class-validator");
const types_1 = require("./types");
const swagger_1 = require("@nestjs/swagger");
class CreateIntroductionDto {
}
exports.CreateIntroductionDto = CreateIntroductionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "mainTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "subTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "tripType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "journeyDuration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "countryName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "cityName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIntroductionDto.prototype, "journeyLocation", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateIntroductionDto.prototype, "totalSeat", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIntroductionDto.prototype, "maximumAge", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIntroductionDto.prototype, "minimumAge", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateIntroductionDto.prototype, "packagePrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIntroductionDto.prototype, "packageDiscount", void 0);
class CreateOverviewDto {
}
exports.CreateOverviewDto = CreateOverviewDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        default: 'This package includes an exciting tour of the city with various activities.',
    }),
    __metadata("design:type", String)
], CreateOverviewDto.prototype, "packageOverview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: types_1.TravelPackageInclusionDto }),
    __metadata("design:type", Array)
], CreateOverviewDto.prototype, "packageInclude", void 0);
class CreateMainImageDto {
}
exports.CreateMainImageDto = CreateMainImageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMainImageDto.prototype, "path", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMainImageDto.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMainImageDto.prototype, "mainTitle", void 0);
class CreateVisitPlaceDto {
}
exports.CreateVisitPlaceDto = CreateVisitPlaceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVisitPlaceDto.prototype, "path", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVisitPlaceDto.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVisitPlaceDto.prototype, "pictureName", void 0);
class CreateTourPlanDto {
}
exports.CreateTourPlanDto = CreateTourPlanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourPlanDto.prototype, "tourPlanTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourPlanDto.prototype, "dayPlan", void 0);
class CreateObjectivesDto {
}
exports.CreateObjectivesDto = CreateObjectivesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: types_1.Inclusion }),
    __metadata("design:type", Array)
], CreateObjectivesDto.prototype, "inclusion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: types_1.Exclusion }),
    __metadata("design:type", Array)
], CreateObjectivesDto.prototype, "exclusion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: types_1.BookingPolicy }),
    __metadata("design:type", Array)
], CreateObjectivesDto.prototype, "bookingPolicy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: types_1.RefundPolicy }),
    __metadata("design:type", Array)
], CreateObjectivesDto.prototype, "refundPolicy", void 0);
class CreateMetaInfoDto {
}
exports.CreateMetaInfoDto = CreateMetaInfoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMetaInfoDto.prototype, "metaTitle", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateMetaInfoDto.prototype, "metaKeywords", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMetaInfoDto.prototype, "metaDescription", void 0);
class CreateTourPackageDto {
}
exports.CreateTourPackageDto = CreateTourPackageDto;
__decorate([
    (0, class_validator_2.ValidateNested)(),
    (0, swagger_1.ApiProperty)({ type: CreateIntroductionDto }),
    (0, class_transformer_1.Type)(() => CreateIntroductionDto),
    __metadata("design:type", CreateIntroductionDto)
], CreateTourPackageDto.prototype, "introduction", void 0);
__decorate([
    (0, class_validator_2.ValidateNested)(),
    (0, swagger_1.ApiProperty)({ type: CreateOverviewDto }),
    (0, class_transformer_1.Type)(() => CreateOverviewDto),
    __metadata("design:type", CreateOverviewDto)
], CreateTourPackageDto.prototype, "overview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreateMainImageDto }),
    (0, class_validator_2.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateMainImageDto),
    __metadata("design:type", Array)
], CreateTourPackageDto.prototype, "mainImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreateVisitPlaceDto }),
    (0, class_validator_2.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateVisitPlaceDto),
    __metadata("design:type", Array)
], CreateTourPackageDto.prototype, "visitPlace", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreateTourPlanDto }),
    (0, class_validator_2.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateTourPlanDto),
    __metadata("design:type", Array)
], CreateTourPackageDto.prototype, "tourPlan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreateObjectivesDto }),
    (0, class_validator_2.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateObjectivesDto),
    __metadata("design:type", Array)
], CreateTourPackageDto.prototype, "objectives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreateMetaInfoDto }),
    (0, class_validator_2.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateMetaInfoDto),
    __metadata("design:type", CreateMetaInfoDto)
], CreateTourPackageDto.prototype, "metaInfo", void 0);
//# sourceMappingURL=create-tour-package.dto.js.map