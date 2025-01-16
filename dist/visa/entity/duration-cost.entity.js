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
exports.DurationCost = void 0;
const typeorm_1 = require("typeorm");
const visa_entity_1 = require("./visa.entity");
let DurationCost = class DurationCost {
};
exports.DurationCost = DurationCost;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DurationCost.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal'),
    __metadata("design:type", Number)
], DurationCost.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DurationCost.prototype, "entry", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DurationCost.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DurationCost.prototype, "maximumStay", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DurationCost.prototype, "processingTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DurationCost.prototype, "interview", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DurationCost.prototype, "embassyFee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DurationCost.prototype, "agentFee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DurationCost.prototype, "serviceCharge", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DurationCost.prototype, "processingFee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => visa_entity_1.Visa, visa => visa.durationCosts),
    __metadata("design:type", visa_entity_1.Visa)
], DurationCost.prototype, "visa", void 0);
exports.DurationCost = DurationCost = __decorate([
    (0, typeorm_1.Entity)('duration_cost')
], DurationCost);
//# sourceMappingURL=duration-cost.entity.js.map