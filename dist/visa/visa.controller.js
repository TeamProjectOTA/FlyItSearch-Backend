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
exports.VisaController = void 0;
const common_1 = require("@nestjs/common");
const visa_service_1 = require("./visa.service");
const visa_all_dto_1 = require("./dto/visa-all.dto");
const swagger_1 = require("@nestjs/swagger");
const visa_entity_1 = require("./entity/visa.entity");
let VisaController = class VisaController {
    constructor(visaService) {
        this.visaService = visaService;
    }
    create(visaAllDto) {
        return this.visaService.createVisaAll(visaAllDto);
    }
    async findAll(page = 1, limit = 10) {
        limit = Math.min(limit, 100);
        return this.visaService.findAll(page, limit);
    }
    findOne(id) {
        return this.visaService.findOne(id);
    }
    delete(id) {
        return this.visaService.deleteVisa(id);
    }
    async updateVisa(id, visaAllDto) {
        try {
            const updatedVisa = await this.visaService.updateVisaAll(id, visaAllDto);
            return updatedVisa;
        }
        catch (error) {
            throw new Error(`Error updating visa: ${error.message}`);
        }
    }
};
exports.VisaController = VisaController;
__decorate([
    (0, common_1.Post)("/createVisa"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [visa_all_dto_1.VisaAllDto]),
    __metadata("design:returntype", void 0)
], VisaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("/findAllVisa"),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'successfull',
        content: {
            'application/json': {
                example: {
                    data: [
                        {
                            departureCountry: "Bangladesh",
                            arrivalCountry: "United States",
                            visaCategory: "Tourist",
                            visaType: "Single-entry",
                            cost: "200.00",
                            durationCosts: [
                                {
                                    cost: "1500.00",
                                    entry: "Consulate",
                                    duration: "30 days",
                                    maximumStay: "90 days",
                                    processingTime: "10 business days",
                                    interview: "Mandatory",
                                    embassyFee: "100 USD",
                                    agentFee: "50 USD",
                                    serviceCharge: "20 USD",
                                    processingFee: "30 USD"
                                }
                            ],
                            visaRequiredDocuments: {
                                profession: "Software Engineer",
                                documents: "Required document",
                                exceptionalCase: "If the applicant has no recent work experience, they may submit a self-declaration letter.",
                                note: "Documents must be in English or translated to English."
                            }
                        }
                    ],
                    total: 20,
                    page: "1",
                    limit: 1,
                    totalPages: 20
                }
            }
        }
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], VisaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VisaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)('/deleteVisa/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VisaController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)('/updateVisa/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Partially update Visa and related entities' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Visa updated successfully',
        type: visa_entity_1.Visa,
        example: {
            'application/json': {
                id: 19,
                departureCountry: "India",
                arrivalCountry: "United States",
                visaCategory: "Tourist",
                visaType: "Single-entry",
                cost: 200.00,
                createdAt: "2025-01-16T08:19:33.000Z",
                updatedAt: "2025-01-16T08:19:33.000Z",
                durationCosts: [
                    {
                        id: 29,
                        cost: 1500.00,
                        entry: "Consulate",
                        duration: "30 days",
                        maximumStay: "90 days",
                        processingTime: "10 business days",
                        interview: "Mandatory",
                        embassyFee: "100 USD",
                        agentFee: "50 USD",
                        serviceCharge: "20 USD",
                        processingFee: "30 USD"
                    }
                ],
                visaRequiredDocuments: {
                    id: 18,
                    profession: "Software Engineer",
                    documents: "Required document",
                    exceptionalCase: "If the applicant has no recent work experience, they may submit a self-declaration letter.",
                    note: "Documents must be in English or translated to English.",
                    createdAt: "2025-01-16T08:19:33.000Z",
                    updatedAt: "2025-01-16T08:19:33.000Z"
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Visa not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, visa_all_dto_1.VisaAllDto]),
    __metadata("design:returntype", Promise)
], VisaController.prototype, "updateVisa", null);
exports.VisaController = VisaController = __decorate([
    (0, swagger_1.ApiTags)("Visa"),
    (0, common_1.Controller)('visa'),
    __metadata("design:paramtypes", [visa_service_1.VisaService])
], VisaController);
//# sourceMappingURL=visa.controller.js.map