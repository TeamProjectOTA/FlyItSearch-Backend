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
exports.File = exports.SsrType = exports.Ssr = exports.UserDetails = exports.ResponseDto = exports.Designation = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
var Designation;
(function (Designation) {
    Designation["Mr"] = "Mr";
    Designation["MRS"] = "MRS";
})(Designation || (exports.Designation = Designation = {}));
class ResponseDto {
}
exports.ResponseDto = ResponseDto;
class UserDetails {
}
exports.UserDetails = UserDetails;
__decorate([
    (0, class_validator_1.IsEnum)(Designation),
    __metadata("design:type", String)
], UserDetails.prototype, "designation", void 0);
class Ssr {
}
exports.Ssr = Ssr;
class SsrType {
}
exports.SsrType = SsrType;
let File = class File {
};
exports.File = File;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], File.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], File.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DEFAULT_PATH' }),
    __metadata("design:type", String)
], File.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], File.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], File.prototype, "mimetype", void 0);
exports.File = File = __decorate([
    (0, typeorm_1.Entity)()
], File);
//# sourceMappingURL=book.model.js.map