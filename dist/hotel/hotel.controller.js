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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelController = void 0;
const common_1 = require("@nestjs/common");
const hotel_service_1 = require("./hotel.service");
const sabre_hotel_service_1 = require("./API Utils/sabre.hotel.service");
const swagger_1 = require("@nestjs/swagger");
const hoteldto_1 = require("./DTO/hoteldto");
let HotelController = class HotelController {
    constructor(hotelService, sabreHotel) {
        this.hotelService = hotelService;
        this.sabreHotel = sabreHotel;
    }
    async hotelRequest(hoteldto) {
        return await this.sabreHotel.sabreHotelRequest(hoteldto);
    }
    async getIp() {
        return this.hotelService.getIp();
    }
    async redirectUrl(res) {
        const url = await this.hotelService.getRedirectUrl();
        res.redirect(url);
    }
};
exports.HotelController = HotelController;
__decorate([
    (0, common_1.Post)('/sabre'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hoteldto_1.RootDto]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "hotelRequest", null);
__decorate([
    (0, common_1.Get)('ip'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getIp", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "redirectUrl", null);
exports.HotelController = HotelController = __decorate([
    (0, swagger_1.ApiTags)('Hotel api'),
    (0, common_1.Controller)('hotel'),
    __metadata("design:paramtypes", [hotel_service_1.HotelService,
        sabre_hotel_service_1.SabreHotel])
], HotelController);
//# sourceMappingURL=hotel.controller.js.map