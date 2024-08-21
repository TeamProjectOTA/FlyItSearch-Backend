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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditionsController = void 0;
const common_1 = require("@nestjs/common");
const terms_and_conditions_service_1 = require("./terms-and-conditions.service");
const update_terms_and_condition_dto_1 = require("./dto/update-terms-and-condition.dto");
const swagger_1 = require("@nestjs/swagger");
let TermsAndConditionsController = class TermsAndConditionsController {
    constructor(termsAndConditionsService) {
        this.termsAndConditionsService = termsAndConditionsService;
    }
    findAll() {
        return this.termsAndConditionsService.findAll();
    }
    update(id, updateTermsAndConditionDto) {
        return this.termsAndConditionsService.update(+id, updateTermsAndConditionDto);
    }
};
exports.TermsAndConditionsController = TermsAndConditionsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TermsAndConditionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_terms_and_condition_dto_1.UpdateTermsAndConditionDto]),
    __metadata("design:returntype", void 0)
], TermsAndConditionsController.prototype, "update", null);
exports.TermsAndConditionsController = TermsAndConditionsController = __decorate([
    (0, swagger_1.ApiTags)('Terms And Conditions'),
    (0, common_1.Controller)('terms-and-conditions'),
    __metadata("design:paramtypes", [terms_and_conditions_service_1.TermsAndConditionsService])
], TermsAndConditionsController);
//# sourceMappingURL=terms-and-conditions.controller.js.map