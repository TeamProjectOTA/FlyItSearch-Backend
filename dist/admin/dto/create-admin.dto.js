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
exports.CreateAdminDto = void 0;
const swagger_1 = require("@nestjs/swagger");
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
})(Status || (Status = {}));
class CreateAdminDto {
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Hasibul' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Islam' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'hasibul@gmail.com' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: '0114378661' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'admin' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'Super Admin' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'ACTIVE' }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "status", void 0);
//# sourceMappingURL=create-admin.dto.js.map