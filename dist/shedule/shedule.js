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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Shedule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shedule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_model_1 = require("../book/booking.model");
const flight_model_1 = require("../flight/flight.model");
const typeorm_2 = require("typeorm");
let Shedule = Shedule_1 = class Shedule {
    constructor(bookingRepository, bookingIdRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingIdRepository = bookingIdRepository;
        this.username = process.env.FLYHUB_UserName;
        this.apiKey = process.env.FLYHUB_ApiKey;
        this.apiUrl = process.env.FLyHub_Url;
        this.logger = new common_1.Logger(Shedule_1.name);
    }
};
exports.Shedule = Shedule;
exports.Shedule = Shedule = Shedule_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_model_1.BookingSave)),
    __param(1, (0, typeorm_1.InjectRepository)(flight_model_1.BookingIdSave)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], Shedule);
//# sourceMappingURL=shedule.js.map