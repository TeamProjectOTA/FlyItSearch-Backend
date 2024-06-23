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
exports.Overview = void 0;
const typeorm_1 = require("typeorm");
const tour_package_entity_1 = require("./tour-package.entity");
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
__decorate([
    (0, typeorm_1.OneToOne)(() => tour_package_entity_1.TourPackage, tourPackage => tourPackage.overview),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", tour_package_entity_1.TourPackage)
], Overview.prototype, "tourPackage", void 0);
exports.Overview = Overview = __decorate([
    (0, typeorm_1.Entity)()
], Overview);
//# sourceMappingURL=overview.model.js.map