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
exports.RefundPolicy = exports.BookingPolicy = exports.Exclusion = exports.Inclusion = exports.TravelPackageInclusionDto = exports.PackageInclude = exports.TripType = void 0;
const swagger_1 = require("@nestjs/swagger");
var TripType;
(function (TripType) {
    TripType["tp1"] = "Family Tour";
    TripType["tp2"] = "Group Tour";
    TripType["tp3"] = "Relax";
})(TripType || (exports.TripType = TripType = {}));
var PackageInclude;
(function (PackageInclude) {
    PackageInclude["pI1"] = "Flights";
    PackageInclude["pI2"] = "Hotels";
    PackageInclude["pI3"] = "Foods";
    PackageInclude["pI4"] = "Transport";
})(PackageInclude || (exports.PackageInclude = PackageInclude = {}));
class TravelPackageInclusionDto {
}
exports.TravelPackageInclusionDto = TravelPackageInclusionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PackageInclude }),
    __metadata("design:type", String)
], TravelPackageInclusionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Details about the inclusion.' }),
    __metadata("design:type", String)
], TravelPackageInclusionDto.prototype, "details", void 0);
class Inclusion {
}
exports.Inclusion = Inclusion;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'This is the Inclusion' }),
    __metadata("design:type", String)
], Inclusion.prototype, "data", void 0);
class Exclusion {
}
exports.Exclusion = Exclusion;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'This is the Exclusion' }),
    __metadata("design:type", String)
], Exclusion.prototype, "data", void 0);
class BookingPolicy {
}
exports.BookingPolicy = BookingPolicy;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'This is the booking policy' }),
    __metadata("design:type", String)
], BookingPolicy.prototype, "data", void 0);
class RefundPolicy {
}
exports.RefundPolicy = RefundPolicy;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'This is the Refund Policy' }),
    __metadata("design:type", String)
], RefundPolicy.prototype, "data", void 0);
//# sourceMappingURL=types.js.map