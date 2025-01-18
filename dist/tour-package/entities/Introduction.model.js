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
exports.Introduction = void 0;
const typeorm_1 = require("typeorm");
const tourPackage_model_1 = require("./tourPackage.model");
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
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
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
    __metadata("design:type", Boolean)
], Introduction.prototype, "withAirFare", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Introduction.prototype, "withHotel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "packageDiscountType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "packageDiscountAmount", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => tourPackage_model_1.TourPackage, (tourPackage) => tourPackage.introduction, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", tourPackage_model_1.TourPackage)
], Introduction.prototype, "tourPackage", void 0);
exports.Introduction = Introduction = __decorate([
    (0, typeorm_1.Entity)('introduction')
], Introduction);
//# sourceMappingURL=Introduction.model.js.map