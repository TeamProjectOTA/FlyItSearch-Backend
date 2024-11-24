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
exports.NewTicket = exports.vendorTicket = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
class vendorTicket {
}
exports.vendorTicket = vendorTicket;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], vendorTicket.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], vendorTicket.prototype, "airlinesPNR", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], vendorTicket.prototype, "vendorAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], vendorTicket.prototype, "profit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], vendorTicket.prototype, "vendorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], vendorTicket.prototype, "segmentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], vendorTicket.prototype, "ticketNumber", void 0);
let NewTicket = class NewTicket {
};
exports.NewTicket = NewTicket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NewTicket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NewTicket.prototype, "gdsPNR", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NewTicket.prototype, "airlinesPNR", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NewTicket.prototype, "vendorName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NewTicket.prototype, "loss_profit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NewTicket.prototype, "segmentCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NewTicket.prototype, "flyHubPNR", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], NewTicket.prototype, "dealAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], NewTicket.prototype, "inVoiceAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], NewTicket.prototype, "ticket", void 0);
exports.NewTicket = NewTicket = __decorate([
    (0, typeorm_1.Entity)()
], NewTicket);
//# sourceMappingURL=amin-dashboardDto.js.map