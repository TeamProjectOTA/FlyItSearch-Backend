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
exports.Objectives = exports.TourPlan = exports.VisitPlace = exports.MainImage = exports.TourPackage = void 0;
const typeorm_1 = require("typeorm");
const Introduction_model_1 = require("./Introduction.model");
const overview_model_1 = require("./overview.model");
const metaInfo_model_1 = require("./metaInfo.model");
let TourPackage = class TourPackage {
};
exports.TourPackage = TourPackage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TourPackage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Introduction_model_1.Introduction, { cascade: true, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Introduction_model_1.Introduction)
], TourPackage.prototype, "introduction", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => overview_model_1.Overview, { cascade: true, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", overview_model_1.Overview)
], TourPackage.prototype, "overview", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MainImage, (mainImage) => mainImage.id, { cascade: true, eager: true }),
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
    (0, typeorm_1.OneToOne)(() => metaInfo_model_1.MetaInfo, { cascade: true, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", metaInfo_model_1.MetaInfo)
], TourPackage.prototype, "metaInfo", void 0);
exports.TourPackage = TourPackage = __decorate([
    (0, typeorm_1.Entity)()
], TourPackage);
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
], MainImage.prototype, "mainTitle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TourPackage, (tourPackage) => tourPackage.mainImage),
    __metadata("design:type", TourPackage)
], MainImage.prototype, "tourPackage", void 0);
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
], VisitPlace.prototype, "mainTitle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TourPackage, (tourPackage) => tourPackage.visitPlace),
    __metadata("design:type", TourPackage)
], VisitPlace.prototype, "tourPackage", void 0);
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
__decorate([
    (0, typeorm_1.ManyToOne)(() => TourPackage, (tourPackage) => tourPackage.tourPlan),
    __metadata("design:type", TourPackage)
], TourPlan.prototype, "tourPackage", void 0);
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
__decorate([
    (0, typeorm_1.ManyToOne)(() => TourPackage, (tourPackage) => tourPackage.objectives),
    __metadata("design:type", TourPackage)
], Objectives.prototype, "tourPackage", void 0);
exports.Objectives = Objectives = __decorate([
    (0, typeorm_1.Entity)()
], Objectives);
//# sourceMappingURL=tour-package.entity.js.map