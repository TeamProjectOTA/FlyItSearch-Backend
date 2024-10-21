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
exports.VisaPassport = exports.ProfilePicture = void 0;
const booking_model_1 = require("../book/booking.model");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let ProfilePicture = class ProfilePicture {
};
exports.ProfilePicture = ProfilePicture;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProfilePicture.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProfilePicture.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProfilePicture.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProfilePicture.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.profilePicture, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], ProfilePicture.prototype, "user", void 0);
exports.ProfilePicture = ProfilePicture = __decorate([
    (0, typeorm_1.Entity)()
], ProfilePicture);
let VisaPassport = class VisaPassport {
};
exports.VisaPassport = VisaPassport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VisaPassport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], VisaPassport.prototype, "passportLink", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VisaPassport.prototype, "visaLink", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_model_1.BookingSave, (bookingSave) => bookingSave.visaPassport, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", booking_model_1.BookingSave)
], VisaPassport.prototype, "bookingSave", void 0);
exports.VisaPassport = VisaPassport = __decorate([
    (0, typeorm_1.Entity)()
], VisaPassport);
//# sourceMappingURL=uploads.model.js.map