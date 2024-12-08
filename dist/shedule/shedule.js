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
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("axios");
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
        this.apiUrlbdf = process.env.BDFareAPI_URL;
        this.apiKeybdf = process.env.BDFareAPI_KEY;
        this.logger = new common_1.Logger(Shedule_1.name);
    }
    async scheduling() {
        const bookingSave = await this.bookingRepository.find();
        const nowdate = new Date(Date.now());
        const dhakaOffset = 6 * 60 * 60 * 1000;
        const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
        for (const booking of bookingSave) {
            const timeLeft = new Date(booking.expireDate);
            if (dhakaTime.getTime() >= timeLeft.getTime() &&
                booking.bookingStatus === 'Booked') {
                const userBooking = await this.bookingRepository.findOne({
                    where: { bookingId: booking.bookingId },
                });
                if (userBooking.system == "API1") {
                    const cancelData = await this.aircancel(booking.bookingId);
                    this.logger.log("API1 hit ");
                    if (cancelData?.BookingStatus) {
                        userBooking.bookingStatus = cancelData?.BookingStatus;
                    }
                    else {
                        userBooking.bookingStatus = 'Cancelled';
                    }
                }
                else if (userBooking.system == "API2") {
                    const cancelData = await this.flightBookingCancel(booking.bookingId);
                    this.logger.log("API2 hit " + cancelData.orderStatus);
                    if (cancelData.orderStatus) {
                        userBooking.bookingStatus = cancelData?.orderStatus;
                    }
                    else {
                        userBooking.bookingStatus = 'Cancelled';
                    }
                }
                await this.bookingRepository.save(userBooking);
            }
        }
        this.logger.log('Hitting the sheduling in every 5min ');
    }
    async getToken() {
        try {
            const config = {
                method: 'post',
                url: `${this.apiUrl}/Authenticate`,
                data: {
                    username: this.username,
                    apiKey: this.apiKey,
                },
            };
            const response = await axios_1.default.request(config);
            const token = response?.data?.TokenId;
            if (!token) {
                throw new common_1.HttpException('Token not found in response', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return token;
        }
        catch (error) {
            console.error('Error fetching token:', error.response?.data || error.message);
            throw new common_1.HttpException('Failed to authenticate', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async aircancel(BookingID) {
        const bookingId = await this.bookingIdRepository.findOne({
            where: { flyitSearchId: BookingID },
        });
        const flyhubId = bookingId.flyhubId;
        const token = await this.getToken();
        const ticketCancel = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirCancel`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: { BookingID: flyhubId },
        };
        try {
            const response = await axios_1.default.request(ticketCancel);
            return response;
        }
        catch (error) {
            throw error?.response?.data;
        }
    }
    async flightBookingCancel(BookingID) {
        const bookingId = await this.bookingIdRepository.findOne({
            where: { flyitSearchId: BookingID },
        });
        const orderReference = { orderReference: bookingId.flyhubId };
        try {
            const response = await axios_1.default.post(`${this.apiUrlbdf}/OrderCancel`, orderReference, {
                headers: {
                    'X-API-KEY': this.apiKeybdf,
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.response.orderStatus == 'Cancelled') {
                return response.data.response;
            }
            return response.data;
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.Shedule = Shedule;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Shedule.prototype, "scheduling", null);
exports.Shedule = Shedule = Shedule_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_model_1.BookingSave)),
    __param(1, (0, typeorm_1.InjectRepository)(flight_model_1.BookingIdSave)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], Shedule);
//# sourceMappingURL=shedule.js.map