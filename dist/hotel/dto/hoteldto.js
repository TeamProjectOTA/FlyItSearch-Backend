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
exports.RootDto = exports.GetHotelAvailRQDto = exports.SearchCriteriaDto = exports.ImageRefDto = exports.HotelPrefDto = exports.SabreRatingDto = exports.RateInfoRefDto = exports.RoomsDto = exports.RoomDto = exports.StayDateRangeDto = exports.GeoSearchDto = exports.GeoRefDto = exports.RefPointDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RefPointDto {
}
exports.RefPointDto = RefPointDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DWC' }),
    __metadata("design:type", String)
], RefPointDto.prototype, "Value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CODE' }),
    __metadata("design:type", String)
], RefPointDto.prototype, "ValueContext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6' }),
    __metadata("design:type", String)
], RefPointDto.prototype, "RefPointType", void 0);
class GeoRefDto {
}
exports.GeoRefDto = GeoRefDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    __metadata("design:type", Number)
], GeoRefDto.prototype, "Radius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'KM' }),
    __metadata("design:type", String)
], GeoRefDto.prototype, "UOM", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", RefPointDto)
], GeoRefDto.prototype, "RefPoint", void 0);
class GeoSearchDto {
}
exports.GeoSearchDto = GeoSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", GeoRefDto)
], GeoSearchDto.prototype, "GeoRef", void 0);
class StayDateRangeDto {
}
exports.StayDateRangeDto = StayDateRangeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-28' }),
    __metadata("design:type", String)
], StayDateRangeDto.prototype, "StartDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-30' }),
    __metadata("design:type", String)
], StayDateRangeDto.prototype, "EndDate", void 0);
class RoomDto {
}
exports.RoomDto = RoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RoomDto.prototype, "Index", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RoomDto.prototype, "Adults", void 0);
class RoomsDto {
}
exports.RoomsDto = RoomsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RoomDto] }),
    __metadata("design:type", Array)
], RoomsDto.prototype, "Room", void 0);
class RateInfoRefDto {
}
exports.RateInfoRefDto = RateInfoRefDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], RateInfoRefDto.prototype, "ConvertedRateInfoOnly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BDT' }),
    __metadata("design:type", String)
], RateInfoRefDto.prototype, "CurrencyCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2' }),
    __metadata("design:type", String)
], RateInfoRefDto.prototype, "BestOnly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'IncludePrepaid' }),
    __metadata("design:type", String)
], RateInfoRefDto.prototype, "PrepaidQualifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", StayDateRangeDto)
], RateInfoRefDto.prototype, "StayDateRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", RoomsDto)
], RateInfoRefDto.prototype, "Rooms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '100,110,112,113' }),
    __metadata("design:type", String)
], RateInfoRefDto.prototype, "InfoSource", void 0);
class SabreRatingDto {
}
exports.SabreRatingDto = SabreRatingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3' }),
    __metadata("design:type", String)
], SabreRatingDto.prototype, "Min", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5' }),
    __metadata("design:type", String)
], SabreRatingDto.prototype, "Max", void 0);
class HotelPrefDto {
}
exports.HotelPrefDto = HotelPrefDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", SabreRatingDto)
], HotelPrefDto.prototype, "SabreRating", void 0);
class ImageRefDto {
}
exports.ImageRefDto = ImageRefDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ORIGINAL' }),
    __metadata("design:type", String)
], ImageRefDto.prototype, "Type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EN' }),
    __metadata("design:type", String)
], ImageRefDto.prototype, "LanguageCode", void 0);
class SearchCriteriaDto {
}
exports.SearchCriteriaDto = SearchCriteriaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], SearchCriteriaDto.prototype, "OffSet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TotalRate' }),
    __metadata("design:type", String)
], SearchCriteriaDto.prototype, "SortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ASC' }),
    __metadata("design:type", String)
], SearchCriteriaDto.prototype, "SortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], SearchCriteriaDto.prototype, "PageSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], SearchCriteriaDto.prototype, "TierLabels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", GeoSearchDto)
], SearchCriteriaDto.prototype, "GeoSearch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", RateInfoRefDto)
], SearchCriteriaDto.prototype, "RateInfoRef", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", HotelPrefDto)
], SearchCriteriaDto.prototype, "HotelPref", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", ImageRefDto)
], SearchCriteriaDto.prototype, "ImageRef", void 0);
class GetHotelAvailRQDto {
}
exports.GetHotelAvailRQDto = GetHotelAvailRQDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", SearchCriteriaDto)
], GetHotelAvailRQDto.prototype, "SearchCriteria", void 0);
class RootDto {
}
exports.RootDto = RootDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", GetHotelAvailRQDto)
], RootDto.prototype, "GetHotelAvailRQ", void 0);
//# sourceMappingURL=hoteldto.js.map