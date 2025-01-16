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
            const durationCosts = visaAllDto.durationCosts.map((durationCostDto) => this.durationCostRepository.create({
                ...durationCostDto,
                visa: savedVisa,
            }));
            await this.durationCostRepository.save(durationCosts);
        }
        if (visaAllDto.visaRequiredDocuments) {
            const visaRequiredDocument = visaAllDto.visaRequiredDocuments;
            const visaDocs = this.visaRequiredDocumentsRepository.create({
                ...visaRequiredDocument,
                createdAt: new Date(),
                updatedAt: new Date(),
                visa: savedVisa,
            });
            await this.visaRequiredDocumentsRepository.save(visaDocs);
        }
        return savedVisa;
    }
    async findAll(page = 1, limit = 10) {
        const [data, total] = await this.visaRepository.findAndCount({
            order: { id: "DESC" },
            relations: ['durationCosts', 'visaRequiredDocuments'],
            skip: (page - 1) * limit,
            take: limit,
            select: [
                'id',
                'departureCountry',
                'arrivalCountry',
                'visaCategory',
                'visaType',
                'cost',
            ],
        });
        data.forEach((visa) => {
            delete visa.id;
            if (visa.visaRequiredDocuments) {
                delete visa.visaRequiredDocuments.id;
                delete visa.visaRequiredDocuments.createdAt;
                delete visa.visaRequiredDocuments.updatedAt;
            }
            if (visa.durationCosts) {
                visa.durationCosts.forEach((durationCost) => {
                    delete durationCost.id;
                });
            }
        });
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages
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
    async updateVisaAll(id, visaAllDto) {
        const existingVisa = await this.visaRepository.findOne({
            where: { id },
            relations: ['durationCosts', 'visaRequiredDocuments'],
        });
        if (!existingVisa) {
            throw new Error('Visa not found');
        }
        existingVisa.departureCountry = visaAllDto.departureCountry;
        existingVisa.arrivalCountry = visaAllDto.arrivalCountry;
        existingVisa.visaCategory = visaAllDto.visaCategory;
        existingVisa.visaType = visaAllDto.visaType;
        existingVisa.cost = visaAllDto.cost;
        existingVisa.updatedAt = new Date();
        const updatedVisa = await this.visaRepository.save(existingVisa);
        if (visaAllDto.durationCosts) {
            await this.durationCostRepository.delete({ visa: existingVisa });
            const durationCosts = visaAllDto.durationCosts.map((durationCostDto) => this.durationCostRepository.create({
                ...durationCostDto,
                visa: updatedVisa,
            }));
            await this.durationCostRepository.save(durationCosts);
        }
        if (visaAllDto.visaRequiredDocuments) {
            const visaRequiredDocument = visaAllDto.visaRequiredDocuments;
            if (existingVisa.visaRequiredDocuments) {
                existingVisa.visaRequiredDocuments.profession = visaRequiredDocument.profession;
                existingVisa.visaRequiredDocuments.documents = visaRequiredDocument.documents;
                existingVisa.visaRequiredDocuments.exceptionalCase = visaRequiredDocument.exceptionalCase;
                existingVisa.visaRequiredDocuments.note = visaRequiredDocument.note;
                existingVisa.visaRequiredDocuments.updatedAt = new Date();
                await this.visaRequiredDocumentsRepository.save(existingVisa.visaRequiredDocuments);
            }
            else {
                const visaDocs = this.visaRequiredDocumentsRepository.create({
                    ...visaRequiredDocument,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    visa: updatedVisa,
                });
                await this.visaRequiredDocumentsRepository.save(visaDocs);
            }
        }
        return updatedVisa;
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