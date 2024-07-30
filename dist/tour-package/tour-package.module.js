"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourPackageModule = void 0;
const common_1 = require("@nestjs/common");
const tour_package_service_1 = require("./tour-package.service");
const tour_package_controller_1 = require("./tour-package.controller");
const typeorm_1 = require("@nestjs/typeorm");
const tour_package_entity_1 = require("./entities/tour-package.entity");
const Introduction_model_1 = require("./entities/Introduction.model");
const overview_model_1 = require("./entities/overview.model");
const metaInfo_model_1 = require("./entities/metaInfo.model");
const mainImage_model_1 = require("./entities/mainImage.model");
const visitPlace_model_1 = require("./entities/visitPlace.model");
const objective_model_1 = require("./entities/objective.model");
const tourPlan_Model_1 = require("./entities/tourPlan.Model");
const admin_entity_1 = require("../admin/entities/admin.entity");
let TourPackageModule = class TourPackageModule {
};
exports.TourPackageModule = TourPackageModule;
exports.TourPackageModule = TourPackageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                tour_package_entity_1.TourPackage,
                Introduction_model_1.Introduction,
                overview_model_1.Overview,
                mainImage_model_1.MainImage,
                visitPlace_model_1.VisitPlace,
                tourPlan_Model_1.TourPlan,
                objective_model_1.Objectives,
                metaInfo_model_1.MetaInfo,
                admin_entity_1.Admin
            ]),
        ],
        controllers: [tour_package_controller_1.TourPackageController],
        providers: [tour_package_service_1.TourPackageService],
    })
], TourPackageModule);
//# sourceMappingURL=tour-package.module.js.map