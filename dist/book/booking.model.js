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
exports.CreateSaveBookingDto = exports.BookingID = exports.LagInfo = exports.SaveBooking = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let SaveBooking = class SaveBooking {
};
exports.SaveBooking = SaveBooking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SaveBooking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaveBooking.prototype, "system", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaveBooking.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaveBooking.prototype, "paxCount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaveBooking.prototype, "Curriername", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaveBooking.prototype, "CurrierCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaveBooking.prototype, "flightNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], SaveBooking.prototype, "isRefundable", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], SaveBooking.prototype, "bookingDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], SaveBooking.prototype, "expireDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaveBooking.prototype, "bookingStatus", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaveBooking.prototype, "TripType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => LagInfo, (lagInfo) => lagInfo.saveBooking, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], SaveBooking.prototype, "laginfo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.saveBookings, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], SaveBooking.prototype, "user", void 0);
exports.SaveBooking = SaveBooking = __decorate([
    (0, typeorm_1.Entity)()
], SaveBooking);
let LagInfo = class LagInfo {
};
exports.LagInfo = LagInfo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LagInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LagInfo.prototype, "DepDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LagInfo.prototype, "DepFrom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LagInfo.prototype, "ArrTo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SaveBooking, (saveBooking) => saveBooking.laginfo, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", SaveBooking)
], LagInfo.prototype, "saveBooking", void 0);
exports.LagInfo = LagInfo = __decorate([
    (0, typeorm_1.Entity)()
], LagInfo);
class BookingID {
}
exports.BookingID = BookingID;
__decorate([
    (0, swagger_1.ApiProperty)({ default: '22' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookingID.prototype, "BookingID", void 0);
class CreateLagInfoDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLagInfoDto.prototype, "DepDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLagInfoDto.prototype, "DepFrom", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLagInfoDto.prototype, "ArrTo", void 0);
class CreateSaveBookingDto {
}
exports.CreateSaveBookingDto = CreateSaveBookingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaveBookingDto.prototype, "system", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaveBookingDto.prototype, "bookingId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSaveBookingDto.prototype, "paxCount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaveBookingDto.prototype, "Curriername", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaveBookingDto.prototype, "CurrierCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaveBookingDto.prototype, "flightNumber", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSaveBookingDto.prototype, "isRefundable", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaveBookingDto.prototype, "bookingDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaveBookingDto.prototype, "expireDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaveBookingDto.prototype, "bookingStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaveBookingDto.prototype, "TripType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateLagInfoDto),
    __metadata("design:type", Array)
], CreateSaveBookingDto.prototype, "laginfo", void 0);
//# sourceMappingURL=booking.model.js.map