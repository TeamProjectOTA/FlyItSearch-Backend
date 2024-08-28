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
exports.TermsAndConditionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const terms_and_condition_entity_1 = require("./entities/terms-and-condition.entity");
const typeorm_2 = require("typeorm");
let TermsAndConditionsService = class TermsAndConditionsService {
    constructor(termAndConditionRepository) {
        this.termAndConditionRepository = termAndConditionRepository;
    }
    async findAllSite(catagory) {
        const condition = await this.termAndConditionRepository.findOne({ where: { catagory: catagory } });
        if (!condition) {
            throw new common_1.NotFoundException(`No Terms and Conditons found on ${catagory}. Contect with +8801302086413`);
        }
        return condition;
    }
    async updateSite(updateTermsAndConditionDto, catagory) {
        const text = await this.termAndConditionRepository.findOne({ where: { catagory: catagory } });
        if (!text) {
            throw new common_1.NotFoundException;
        }
        text.text = updateTermsAndConditionDto.text;
        const Updated = await this.termAndConditionRepository.save(text);
        return {
            message: `The term and condition has been changed ..................from................. ${text.text} </br> .........................................TO.......................................................... ${Updated.text}`
        };
    }
};
exports.TermsAndConditionsService = TermsAndConditionsService;
exports.TermsAndConditionsService = TermsAndConditionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(terms_and_condition_entity_1.TermsAndCondition)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TermsAndConditionsService);
//# sourceMappingURL=terms-and-conditions.service.js.map