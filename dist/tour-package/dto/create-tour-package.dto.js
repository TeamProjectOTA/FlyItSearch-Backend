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
exports.CreateTourPackageDto = exports.TripType = void 0;
const swagger_1 = require("@nestjs/swagger");
var TripType;
(function (TripType) {
    TripType["tp1"] = "Family Tour";
    TripType["tp2"] = "Group Tour";
    TripType["tp3"] = "Relax";
})(TripType || (exports.TripType = TripType = {}));
class CreateTourPackageDto {
}
exports.CreateTourPackageDto = CreateTourPackageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Exciting Adventure' }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "mainTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'An unforgettable journey' }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "subTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TripType, isArray: true, default: [TripType.tp1, TripType.tp2] }),
    __metadata("design:type", Array)
], CreateTourPackageDto.prototype, "tripType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '7 days' }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "journeyDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-07-01 (Monday)' }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-07-07 (Sunday)' }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'USA' }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "countryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'New York' }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "cityName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Multiple locations' }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "journeyLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '50' }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "totalSeat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 60 }),
    __metadata("design:type", Number)
], CreateTourPackageDto.prototype, "maximunAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 18 }),
    __metadata("design:type", Number)
], CreateTourPackageDto.prototype, "minimumAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 999.99 }),
    __metadata("design:type", Number)
], CreateTourPackageDto.prototype, "packagePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 10.00 }),
    __metadata("design:type", Number)
], CreateTourPackageDto.prototype, "packageDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'A thrilling 7-day adventure tour through multiple locations.' }),
    __metadata("design:type", String)
], CreateTourPackageDto.prototype, "packageOverview", void 0);
//# sourceMappingURL=create-tour-package.dto.js.map