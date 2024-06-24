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
exports.TourPackage = void 0;
const typeorm_1 = require("typeorm");
const Introduction_model_1 = require("./Introduction.model");
const overview_model_1 = require("./overview.model");
const metaInfo_model_1 = require("./metaInfo.model");
const mainImage_model_1 = require("./mainImage.model");
const visitPlace_model_1 = require("./visitPlace.model");
const tourPlan_Model_1 = require("./tourPlan.Model");
const objective_model_1 = require("./objective.model");
let TourPackage = class TourPackage {
};
exports.TourPackage = TourPackage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TourPackage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Introduction_model_1.Introduction, (introduction) => introduction.tourPackage, {
        cascade: true,
    }),
    __metadata("design:type", Introduction_model_1.Introduction)
], TourPackage.prototype, "introduction", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => overview_model_1.Overview, (overview) => overview.tourPackage, {
        cascade: true,
    }),
    __metadata("design:type", overview_model_1.Overview)
], TourPackage.prototype, "overview", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => mainImage_model_1.MainImage, (mainImage) => mainImage.tourPackage, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], TourPackage.prototype, "mainImage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => visitPlace_model_1.VisitPlace, (visitPlace) => visitPlace.tourPackage, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], TourPackage.prototype, "visitPlace", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tourPlan_Model_1.TourPlan, (tourPlan) => tourPlan.tourPackage, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], TourPackage.prototype, "tourPlan", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => objective_model_1.Objectives, (objectives) => objectives.tourPackage, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], TourPackage.prototype, "objectives", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => metaInfo_model_1.MetaInfo, (metaInfo) => metaInfo.tourPackage, {
        cascade: true,
    }),
    __metadata("design:type", metaInfo_model_1.MetaInfo)
], TourPackage.prototype, "metaInfo", void 0);
exports.TourPackage = TourPackage = __decorate([
    (0, typeorm_1.Entity)()
], TourPackage);
//# sourceMappingURL=tour-package.entity.js.map