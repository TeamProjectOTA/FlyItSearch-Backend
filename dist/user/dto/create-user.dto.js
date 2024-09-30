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
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Hasibul Islam' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '01756' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'hasibul.dev506@gmail.com' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '1234' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '1-2-1998' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Male' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Bangladeshi' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "nationility", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Q14596723' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "passport", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "passportexp", void 0);
//# sourceMappingURL=create-user.dto.js.map