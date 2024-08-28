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
const admin_tokens_guard_1 = require("../auth/admin.tokens.guard");
let TermsAndConditionsController = class TermsAndConditionsController {
    constructor(termsAndConditionsService) {
        this.termsAndConditionsService = termsAndConditionsService;
    }
    findAllsite(catagory) {
        return this.termsAndConditionsService.findAllSite(catagory);
    }
    updatesite(catagory, updateTermsAndConditionDto) {
        return this.termsAndConditionsService.updateSite(updateTermsAndConditionDto, catagory);
    }
};
exports.TermsAndConditionsController = TermsAndConditionsController;
__decorate([
    (0, common_1.Get)('site/api/:catagory'),
    __param(0, (0, common_1.Param)('catagory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TermsAndConditionsController.prototype, "findAllsite", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Patch)('admin/site/api/:catagory'),
    __param(0, (0, common_1.Param)('catagory')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_terms_and_condition_dto_1.UpdateTermsAndConditionDto]),
    __metadata("design:returntype", void 0)
], TermsAndConditionsController.prototype, "updatesite", null);
exports.TermsAndConditionsController = TermsAndConditionsController = __decorate([
    (0, swagger_1.ApiTags)('Terms And Conditions'),
    (0, common_1.Controller)('termsAndConditions'),
    __metadata("design:paramtypes", [terms_and_conditions_service_1.TermsAndConditionsService])
], TermsAndConditionsController);
//# sourceMappingURL=terms-and-conditions.controller.js.map