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
exports.HotDeals = exports.HotDealsDto = exports.Category = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
var Category;
(function (Category) {
    Category["FLight"] = "flight";
    Category["Hotel"] = "hotel";
    Category["Tour"] = "tour";
    Category["GroupFare"] = "groupFare";
})(Category || (exports.Category = Category = {}));
class HotDealsDto {
}
exports.HotDealsDto = HotDealsDto;
__decorate([
    (0, class_validator_1.IsEnum)(Category),
    __metadata("design:type", String)
], HotDealsDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HotDealsDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HotDealsDto.prototype, "description", void 0);
let HotDeals = class HotDeals {
};
exports.HotDeals = HotDeals;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HotDeals.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HotDeals.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HotDeals.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HotDeals.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], HotDeals.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HotDeals.prototype, "pictureName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HotDeals.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], HotDeals.prototype, "size", void 0);
exports.HotDeals = HotDeals = __decorate([
    (0, typeorm_1.Entity)()
], HotDeals);
//# sourceMappingURL=hotdeals.model.js.map