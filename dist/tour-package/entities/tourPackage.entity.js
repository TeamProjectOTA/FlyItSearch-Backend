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
exports.TourPlan = exports.Introduction = exports.TourPackage = void 0;
const typeorm_1 = require("typeorm");
let TourPackage = class TourPackage {
};
exports.TourPackage = TourPackage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TourPackage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TourPackage.prototype, "packageId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TourPackage.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TourPackage.prototype, "packageType", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: false }),
    __metadata("design:type", Object)
], TourPackage.prototype, "overView", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: false }),
    __metadata("design:type", Array)
], TourPackage.prototype, "mainImage", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: false }),
    __metadata("design:type", Array)
], TourPackage.prototype, "visitPlace", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: false }),
    __metadata("design:type", Object)
], TourPackage.prototype, "tourPlan", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: false }),
    __metadata("design:type", Object)
], TourPackage.prototype, "objective", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: false }),
    __metadata("design:type", Object)
], TourPackage.prototype, "metaInfo", void 0);
exports.TourPackage = TourPackage = __decorate([
    (0, typeorm_1.Entity)()
], TourPackage);
let Introduction = class Introduction {
};
exports.Introduction = Introduction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Introduction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "mainTitle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "subTitle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "tripType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "journeyDuration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "journeyStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "journeyEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "countryName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "cityName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "journeyLocation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "totalSeat", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "minimumAge", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "maximumAge", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "packagePrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "packageDiscount", void 0);
exports.Introduction = Introduction = __decorate([
    (0, typeorm_1.Entity)()
], Introduction);
let TourPlan = class TourPlan {
};
exports.TourPlan = TourPlan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TourPlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TourPlan.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TourPlan.prototype, "plan", void 0);
exports.TourPlan = TourPlan = __decorate([
    (0, typeorm_1.Entity)()
], TourPlan);
//# sourceMappingURL=tourPackage.entity.js.map