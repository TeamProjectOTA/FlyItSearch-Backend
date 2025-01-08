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
exports.searchResultDtobdf = exports.RequestDto = exports.RequestInnerDto = exports.ShoppingCriteriaDto = exports.TravelPreferencesDto = exports.PaxDto = exports.OriginDestDto = exports.DestArrivalRequestDto = exports.OriginDepRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class OriginDepRequestDto {
}
exports.OriginDepRequestDto = OriginDepRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DAC' }),
    __metadata("design:type", String)
], OriginDepRequestDto.prototype, "iatA_LocationCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '2024-07-25' }),
    __metadata("design:type", String)
], OriginDepRequestDto.prototype, "date", void 0);
class DestArrivalRequestDto {
}
exports.DestArrivalRequestDto = DestArrivalRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'DXB' }),
    __metadata("design:type", String)
], DestArrivalRequestDto.prototype, "iatA_LocationCode", void 0);
class OriginDestDto {
}
exports.OriginDestDto = OriginDestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: OriginDepRequestDto }),
    __metadata("design:type", OriginDepRequestDto)
], OriginDestDto.prototype, "originDepRequest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DestArrivalRequestDto }),
    __metadata("design:type", DestArrivalRequestDto)
], OriginDestDto.prototype, "destArrivalRequest", void 0);
class PaxDto {
}
exports.PaxDto = PaxDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'PAX1' }),
    __metadata("design:type", String)
], PaxDto.prototype, "paxID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'ADT' }),
    __metadata("design:type", String)
], PaxDto.prototype, "ptc", void 0);
class TravelPreferencesDto {
}
exports.TravelPreferencesDto = TravelPreferencesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Economy' }),
    __metadata("design:type", String)
], TravelPreferencesDto.prototype, "cabinCode", void 0);
class ShoppingCriteriaDto {
}
exports.ShoppingCriteriaDto = ShoppingCriteriaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: '1' }),
    __metadata("design:type", String)
], ShoppingCriteriaDto.prototype, "tripType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TravelPreferencesDto }),
    __metadata("design:type", TravelPreferencesDto)
], ShoppingCriteriaDto.prototype, "travelPreferences", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true }),
    __metadata("design:type", Boolean)
], ShoppingCriteriaDto.prototype, "returnUPSellInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true }),
    __metadata("design:type", Boolean)
], ShoppingCriteriaDto.prototype, "preferCombine", void 0);
class RequestInnerDto {
}
exports.RequestInnerDto = RequestInnerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OriginDestDto] }),
    __metadata("design:type", Array)
], RequestInnerDto.prototype, "originDest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PaxDto] }),
    __metadata("design:type", Array)
], RequestInnerDto.prototype, "pax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ShoppingCriteriaDto }),
    __metadata("design:type", ShoppingCriteriaDto)
], RequestInnerDto.prototype, "shoppingCriteria", void 0);
class RequestDto {
}
exports.RequestDto = RequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'BD' }),
    __metadata("design:type", String)
], RequestDto.prototype, "pointOfSale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RequestInnerDto }),
    __metadata("design:type", RequestInnerDto)
], RequestDto.prototype, "request", void 0);
class searchResultDtobdf {
}
exports.searchResultDtobdf = searchResultDtobdf;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], searchResultDtobdf.prototype, "SearchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], searchResultDtobdf.prototype, "ResultId", void 0);
//# sourceMappingURL=bdfare.model.js.map