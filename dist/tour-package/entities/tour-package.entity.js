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
exports.TourPackage = exports.MetaInfo = exports.Objectives = exports.TourPlan = exports.VisitPlace = exports.MainImage = exports.Overview = exports.Introduction = void 0;
const typeorm_1 = require("typeorm");
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
], Introduction.prototype, "journeyDuration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "endDate", void 0);
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
    __metadata("design:type", Number)
], Introduction.prototype, "maximumAge", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Introduction.prototype, "minimumAge", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal'),
    __metadata("design:type", Number)
], Introduction.prototype, "packagePrice", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal'),
    __metadata("design:type", Number)
], Introduction.prototype, "packageDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Introduction.prototype, "packageOverview", void 0);
exports.Introduction = Introduction = __decorate([
    (0, typeorm_1.Entity)()
], Introduction);
let Overview = class Overview {
};
exports.Overview = Overview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Overview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Overview.prototype, "packageOverview", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Array)
], Overview.prototype, "packageInclude", void 0);
exports.Overview = Overview = __decorate([
    (0, typeorm_1.Entity)()
], Overview);
let MainImage = class MainImage {
};
exports.MainImage = MainImage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MainImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MainImage.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MainImage.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MainImage.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MainImage.prototype, "mainTitle", void 0);
exports.MainImage = MainImage = __decorate([
    (0, typeorm_1.Entity)()
], MainImage);
let VisitPlace = class VisitPlace {
};
exports.VisitPlace = VisitPlace;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VisitPlace.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VisitPlace.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VisitPlace.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VisitPlace.prototype, "placeName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VisitPlace.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VisitPlace.prototype, "mainTitle", void 0);
exports.VisitPlace = VisitPlace = __decorate([
    (0, typeorm_1.Entity)()
], VisitPlace);
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
], TourPlan.prototype, "tourPlanTitle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TourPlan.prototype, "dayPlan", void 0);
exports.TourPlan = TourPlan = __decorate([
    (0, typeorm_1.Entity)()
], TourPlan);
let Objectives = class Objectives {
};
exports.Objectives = Objectives;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Objectives.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Objectives.prototype, "objective", void 0);
exports.Objectives = Objectives = __decorate([
    (0, typeorm_1.Entity)()
], Objectives);
let MetaInfo = class MetaInfo {
};
exports.MetaInfo = MetaInfo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MetaInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MetaInfo.prototype, "metaTitle", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], MetaInfo.prototype, "metaKeywords", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MetaInfo.prototype, "metaDescription", void 0);
exports.MetaInfo = MetaInfo = __decorate([
    (0, typeorm_1.Entity)()
], MetaInfo);
let TourPackage = class TourPackage {
};
exports.TourPackage = TourPackage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TourPackage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Introduction, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Introduction)
], TourPackage.prototype, "introduction", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Overview, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Overview)
], TourPackage.prototype, "overview", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MainImage, (mainImage) => mainImage.id, { cascade: true }),
    __metadata("design:type", Array)
], TourPackage.prototype, "mainImage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => VisitPlace, (visitPlace) => visitPlace.id, { cascade: true }),
    __metadata("design:type", Array)
], TourPackage.prototype, "visitPlace", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TourPlan, (tourPlan) => tourPlan.id, { cascade: true }),
    __metadata("design:type", Array)
], TourPackage.prototype, "tourPlan", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Objectives, (objectives) => objectives.id, { cascade: true }),
    __metadata("design:type", Array)
], TourPackage.prototype, "objectives", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => MetaInfo, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", MetaInfo)
], TourPackage.prototype, "metaInfo", void 0);
exports.TourPackage = TourPackage = __decorate([
    (0, typeorm_1.Entity)()
], TourPackage);
//# sourceMappingURL=tour-package.entity.js.map