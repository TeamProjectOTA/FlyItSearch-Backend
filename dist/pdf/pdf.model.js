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
exports.ReportDto = exports.SectionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SectionDto {
}
exports.SectionDto = SectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Introduction' }),
    __metadata("design:type", String)
], SectionDto.prototype, "heading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'This is the introduction section.' }),
    __metadata("design:type", String)
], SectionDto.prototype, "text", void 0);
class ReportDto {
}
exports.ReportDto = ReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sample Report' }),
    __metadata("design:type", String)
], ReportDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], ReportDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-05' }),
    __metadata("design:type", String)
], ReportDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SectionDto] }),
    __metadata("design:type", Array)
], ReportDto.prototype, "sections", void 0);
//# sourceMappingURL=pdf.model.js.map