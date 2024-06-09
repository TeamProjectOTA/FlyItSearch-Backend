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
exports.CreateAgentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAgentDto {
}
exports.CreateAgentDto = CreateAgentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Test agent' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({ default: 'test@gmail.com' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'testCompany' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '014531646' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'S jakuma' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '1234' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['active', 'inactive']),
    (0, swagger_1.ApiProperty)({ default: 'active' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'jdha' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1200 }),
    __metadata("design:type", Number)
], CreateAgentDto.prototype, "credit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'free' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "markuptype", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 10 }),
    __metadata("design:type", Number)
], CreateAgentDto.prototype, "markup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'free' }),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "clientmarkuptype", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 10 }),
    __metadata("design:type", Number)
], CreateAgentDto.prototype, "clientmarkup", void 0);
//# sourceMappingURL=create-agent.dto.js.map