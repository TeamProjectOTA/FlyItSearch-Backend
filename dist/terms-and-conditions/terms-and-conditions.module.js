"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditionsModule = void 0;
const common_1 = require("@nestjs/common");
const terms_and_conditions_service_1 = require("./terms-and-conditions.service");
const terms_and_conditions_controller_1 = require("./terms-and-conditions.controller");
const typeorm_1 = require("@nestjs/typeorm");
const terms_and_condition_entity_1 = require("./entities/terms-and-condition.entity");
let TermsAndConditionsModule = class TermsAndConditionsModule {
};
exports.TermsAndConditionsModule = TermsAndConditionsModule;
exports.TermsAndConditionsModule = TermsAndConditionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([terms_and_condition_entity_1.TermsAndCondition])],
        controllers: [terms_and_conditions_controller_1.TermsAndConditionsController],
        providers: [terms_and_conditions_service_1.TermsAndConditionsService],
    })
], TermsAndConditionsModule);
//# sourceMappingURL=terms-and-conditions.module.js.map