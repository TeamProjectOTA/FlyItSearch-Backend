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
exports.VisaAllDto = exports.VisaRequiredDocumentsDto = exports.DurationCostDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class DurationCostDto {
}
exports.DurationCostDto = DurationCostDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The cost for a specific duration of the visa',
        example: 1500,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DurationCostDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The entry method for the visa application (e.g., consulate, embassy, etc.)',
        example: 'Consulate',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DurationCostDto.prototype, "entry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The duration of stay allowed under this visa (e.g., 30 days, 90 days)',
        example: '30 days',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DurationCostDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The maximum stay period permitted under this visa',
        example: '90 days',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DurationCostDto.prototype, "maximumStay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The processing time required for visa approval',
        example: '10 business days',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DurationCostDto.prototype, "processingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Interview requirements (e.g., mandatory, optional)',
        example: 'Mandatory',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DurationCostDto.prototype, "interview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Embassy fees associated with processing the visa application',
        example: '100 USD',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DurationCostDto.prototype, "embassyFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Agent fees associated with facilitating the visa process',
        example: '50 USD',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DurationCostDto.prototype, "agentFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Service charges applicable during visa processing',
        example: '20 USD',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DurationCostDto.prototype, "serviceCharge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Processing fees for handling the application',
        example: '30 USD',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DurationCostDto.prototype, "processingFee", void 0);
class VisaRequiredDocumentsDto {
}
exports.VisaRequiredDocumentsDto = VisaRequiredDocumentsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The profession for which the visa is required',
        example: 'Software Engineer',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VisaRequiredDocumentsDto.prototype, "profession", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A list of documents required for the visa application',
        example: "Required document"
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Object)
], VisaRequiredDocumentsDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Any exceptional case conditions for specific document requirements',
        example: 'If the applicant has no recent work experience, they may submit a self-declaration letter.',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VisaRequiredDocumentsDto.prototype, "exceptionalCase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the documents or application process',
        example: 'Documents must be in English or translated to English.',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VisaRequiredDocumentsDto.prototype, "note", void 0);
class VisaAllDto {
}
exports.VisaAllDto = VisaAllDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The country from which the visa applicant is departing',
        example: 'India',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VisaAllDto.prototype, "departureCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The country the visa applicant intends to travel to',
        example: 'United States',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VisaAllDto.prototype, "arrivalCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The category of the visa (e.g., work, tourist, student)',
        example: 'Tourist',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VisaAllDto.prototype, "visaCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of visa (e.g., single-entry, multiple-entry)',
        example: 'Single-entry',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VisaAllDto.prototype, "visaType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The cost associated with obtaining the visa',
        example: 200,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VisaAllDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Duration cost details (e.g., cost for different durations)',
        type: [DurationCostDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], VisaAllDto.prototype, "durationCosts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The required documents for the visa',
        type: VisaRequiredDocumentsDto,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", VisaRequiredDocumentsDto)
], VisaAllDto.prototype, "visaRequiredDocuments", void 0);
//# sourceMappingURL=visa-all.dto.js.map