"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SabreHotel = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const base64 = require("base-64");
let SabreHotel = class SabreHotel {
    async restToken() {
        const client_id_raw = `V1:${process.env.SABRE_ID}:${process.env.SABRE_PCC}:AA`;
        const client_id = base64.encode(client_id_raw);
        const client_secret = base64.encode(process.env.SABRE_PASSWORD);
        const token = base64.encode(`${client_id}:${client_secret}`);
        const data = 'grant_type=client_credentials';
        const headers = {
            Authorization: `Basic ${token}`,
            Accept: '/',
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        try {
            const response = await axios_1.default.post(process.env.SABRE_AUTH_ENDPOINT, data, {
                headers,
            });
            const result = response?.data;
            return result['access_token'];
        }
        catch (err) {
            console.log(err);
        }
    }
    async sabreHotelRequest(hotelDto) {
        const token = await this.restToken();
        const reqBody = hotelDto;
        const shoppingrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.SABRE_BASE_URL}/v3.0.0/get/hotelavail`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: reqBody,
        };
        try {
            const response = await axios_1.default.request(shoppingrequest);
            const result = response?.data;
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
};
exports.SabreHotel = SabreHotel;
exports.SabreHotel = SabreHotel = __decorate([
    (0, common_1.Injectable)()
], SabreHotel);
//# sourceMappingURL=sabre.hotel.service.js.map