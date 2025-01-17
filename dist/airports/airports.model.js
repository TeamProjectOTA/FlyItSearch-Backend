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
exports.CreateAirportDto = exports.Airport = exports.AirportsModelUpdate = exports.AirportsModel = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let AirportsModel = class AirportsModel {
};
exports.AirportsModel = AirportsModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AirportsModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirportsModel.prototype, "iata", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirportsModel.prototype, "icao", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirportsModel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirportsModel.prototype, "city_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirportsModel.prototype, "country_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirportsModel.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AirportsModel.prototype, "utc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 6 }),
    __metadata("design:type", Number)
], AirportsModel.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 9, scale: 6 }),
    __metadata("design:type", Number)
], AirportsModel.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AirportsModel.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AirportsModel.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], AirportsModel.prototype, "uid", void 0);
exports.AirportsModel = AirportsModel = __decorate([
    (0, typeorm_1.Entity)({ name: 'airportsdata' })
], AirportsModel);
class AirportsModelUpdate {
}
exports.AirportsModelUpdate = AirportsModelUpdate;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AirportsModelUpdate.prototype, "iata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AirportsModelUpdate.prototype, "icao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AirportsModelUpdate.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AirportsModelUpdate.prototype, "city_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AirportsModelUpdate.prototype, "country_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AirportsModelUpdate.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AirportsModelUpdate.prototype, "utc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AirportsModelUpdate.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AirportsModelUpdate.prototype, "longitude", void 0);
let Airport = class Airport {
};
exports.Airport = Airport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Airport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Airport.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Airport.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Airport.prototype, "cityCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Airport.prototype, "cityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Airport.prototype, "countryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Airport.prototype, "countryCode", void 0);
exports.Airport = Airport = __decorate([
    (0, typeorm_1.Entity)('airports')
], Airport);
class CreateAirportDto {
}
exports.CreateAirportDto = CreateAirportDto;
//# sourceMappingURL=airports.model.js.map