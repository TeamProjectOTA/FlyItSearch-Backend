"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourpackageModule = void 0;
const common_1 = require("@nestjs/common");
const tourpackage_service_1 = require("./tourpackage.service");
const tourpackage_controller_1 = require("./tourpackage.controller");
const typeorm_1 = require("@nestjs/typeorm");
const tourpackage_model_1 = require("./tourpackage.model");
let TourpackageModule = class TourpackageModule {
};
exports.TourpackageModule = TourpackageModule;
exports.TourpackageModule = TourpackageModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tourpackage_model_1.Tourpackage])],
        providers: [tourpackage_service_1.TourpackageService],
        controllers: [tourpackage_controller_1.TourpackageController],
    })
], TourpackageModule);
//# sourceMappingURL=tourpackage.module.js.map