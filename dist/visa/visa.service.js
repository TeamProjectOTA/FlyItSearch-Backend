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
exports.VisaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const visa_entity_1 = require("./entity/visa.entity");
const duration_cost_entity_1 = require("./entity/duration-cost.entity");
const visa_required_documents_entity_1 = require("./entity/visa-required-documents.entity");
let VisaService = class VisaService {
    constructor(visaRepository, durationCostRepository, visaRequiredDocumentsRepository) {
        this.visaRepository = visaRepository;
        this.durationCostRepository = durationCostRepository;
        this.visaRequiredDocumentsRepository = visaRequiredDocumentsRepository;
    }
    async createVisaAll(visaAllDto) {
        const visa = this.visaRepository.create({
            departureCountry: visaAllDto.departureCountry,
            arrivalCountry: visaAllDto.arrivalCountry,
            visaCategory: visaAllDto.visaCategory,
            visaType: visaAllDto.visaType,
            cost: visaAllDto.cost,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const savedVisa = await this.visaRepository.save(visa);
        if (visaAllDto.durationCosts) {
            const durationCosts = visaAllDto.durationCosts.map(durationCostDto => {
                const durationCost = this.durationCostRepository.create({
                    cost: durationCostDto.cost,
                    entry: durationCostDto.entry,
                    duration: durationCostDto.duration,
                    maximumStay: durationCostDto.maximumStay,
                    processingTime: durationCostDto.processingTime,
                    visa: savedVisa,
                });
                return this.durationCostRepository.save(durationCost);
            });
            await Promise.all(durationCosts);
        }
        if (visaAllDto.visaRequiredDocuments) {
            const visaRequiredDocuments = visaAllDto.visaRequiredDocuments.map(docDto => {
                const visaDocs = this.visaRequiredDocumentsRepository.create({
                    profession: docDto.profession,
                    documents: docDto.documents,
                    exceptionalCase: docDto.exceptionalCase,
                    note: docDto.note,
                    visa: savedVisa,
                });
                return this.visaRequiredDocumentsRepository.save(visaDocs);
            });
            await Promise.all(visaRequiredDocuments);
        }
        return savedVisa;
    }
    async findAll(page = 1, limit = 10) {
        const [data, total] = await this.visaRepository.findAndCount({
            relations: ['durationCosts', 'visaRequiredDocuments'],
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const visa = await this.visaRepository.findOne({
            where: { id },
            relations: ['durationCosts', 'visaRequiredDocuments'],
        });
        if (!visa) {
            throw new common_1.NotFoundException();
        }
        return visa;
    }
    async deleteVisa(id) {
        const visa = await this.visaRepository.findOne({
            where: { id },
            relations: ['durationCosts', 'visaRequiredDocuments'],
        });
        if (!visa) {
            throw new common_1.NotFoundException;
        }
        return await this.visaRepository.remove(visa);
    }
};
exports.VisaService = VisaService;
exports.VisaService = VisaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(visa_entity_1.Visa)),
    __param(1, (0, typeorm_1.InjectRepository)(duration_cost_entity_1.DurationCost)),
    __param(2, (0, typeorm_1.InjectRepository)(visa_required_documents_entity_1.VisaRequiredDocuments)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VisaService);
//# sourceMappingURL=visa.service.js.map