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
exports.VisaRequiredDocuments = void 0;
const typeorm_1 = require("typeorm");
const visa_entity_1 = require("./visa.entity");
let VisaRequiredDocuments = class VisaRequiredDocuments {
};
exports.VisaRequiredDocuments = VisaRequiredDocuments;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VisaRequiredDocuments.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VisaRequiredDocuments.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VisaRequiredDocuments.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], VisaRequiredDocuments.prototype, "exceptionalCase", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], VisaRequiredDocuments.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], VisaRequiredDocuments.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], VisaRequiredDocuments.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => visa_entity_1.Visa, visa => visa.visaRequiredDocuments),
    (0, typeorm_1.JoinColumn)({ name: 'visa_id' }),
    __metadata("design:type", visa_entity_1.Visa)
], VisaRequiredDocuments.prototype, "visa", void 0);
exports.VisaRequiredDocuments = VisaRequiredDocuments = __decorate([
    (0, typeorm_1.Entity)('visa_required_documents')
], VisaRequiredDocuments);
//# sourceMappingURL=visa-required-documents.entity.js.map