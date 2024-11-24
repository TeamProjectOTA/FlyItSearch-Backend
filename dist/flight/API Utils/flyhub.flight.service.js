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
exports.FlyHubService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const flyhub_util_1 = require("./flyhub.util");
const class_transformer_1 = require("class-transformer");
const flyhub_model_1 = require("./Dto/flyhub.model");
const flight_model_1 = require("../flight.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_model_1 = require("../../book/booking.model");
let FlyHubService = class FlyHubService {
    constructor(flyHubUtil, bookingIdSave, bookingSaveRepository) {
        this.flyHubUtil = flyHubUtil;
        this.bookingIdSave = bookingIdSave;
        this.bookingSaveRepository = bookingSaveRepository;
        this.username = process.env.FLYHUB_UserName;
        this.apiKey = process.env.FLYHUB_ApiKey;
        this.apiUrl = process.env.FLyHub_Url;
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
    async searchFlights(reqBody) {
        const token = await this.getToken();
        const shoppingrequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirSearch`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: reqBody,
        };
        try {
            const response = await axios_1.default.request(shoppingrequest);
            return await this.flyHubUtil.restBFMParser(response.data, reqBody.JourneyType);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async aircancel(BookingID, header) {
        const bookingId = await this.bookingIdSave.findOne({
            where: { flyitSearchId: BookingID.BookingID },
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
            return this.flyHubUtil.bookingCancelDataTranformerFlyhub(response.data, BookingID.BookingID, header);
        }
        catch (error) {
            throw error?.response?.data;
        }
    }
    async airRetrive(BookingID, header) {
        const findBooking = await this.bookingSaveRepository.findOne({
            where: { bookingId: BookingID.BookingID },
            relations: ['user'],
        });
        if (findBooking.bookingData[0].GDSPNR) {
            return { bookingData: findBooking.bookingData };
        }
        console.log(findBooking.bookingData[0].GDSPNR);
        const bookingId = await this.bookingIdSave.findOne({
            where: { flyitSearchId: BookingID.BookingID },
        });
        if (!bookingId) {
            throw new common_1.NotFoundException(`No Booking Found with ${BookingID.BookingID}`);
        }
        const flyhubId = bookingId.flyhubId;
        const token = await this.getToken();
        const ticketRetrive = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirRetrieve`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: { BookingID: flyhubId },
        };
        try {
            const response = await axios_1.default.request(ticketRetrive);
            return this.flyHubUtil.airRetriveDataTransformer(response?.data, BookingID.BookingID, findBooking.bookingStatus, findBooking.TripType, findBooking.bookingDate, header);
        }
        catch (error) {
            throw error?.response?.data;
        }
    }
    async bookingRules(data) {
        const token = await this.getToken();
        const ticketCancel = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirMiniRules`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: data,
        };
        try {
            const response = await axios_1.default.request(ticketCancel);
            return response.data;
        }
        catch (error) {
            throw error?.response?.data;
        }
    }
    async airPrice(data) {
        const token = await this.getToken();
        const Price = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirPrice`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: data,
        };
        try {
            const response = await axios_1.default.request(Price);
            if (response.data.Results[0].HoldAllowed === false) {
                throw new common_1.ForbiddenException('Sorry, you cannot book this ticket. Contact our help line for more updates');
            }
            return this.flyHubUtil.restBFMParser(response.data);
        }
        catch (error) {
            throw error;
        }
    }
    async airRules(data) {
        const token = await this.getToken();
        const seeRules = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirRules`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: data,
        };
        try {
            const response = await axios_1.default.request(seeRules);
            return response.data;
        }
        catch (error) {
            throw error?.response?.data;
        }
    }
    async airbook(data, header, currentTimestamp, personIds) {
        const token = await this.getToken();
        const Price = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirPrice`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: data,
        };
        const PreBookticket = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirPreBook`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: data,
        };
        const Bookticket = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirBook`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: data,
        };
        try {
            const response0 = await axios_1.default.request(Price);
            if (response0.data.Results[0].HoldAllowed === false) {
                throw new common_1.ForbiddenException('Sorry, you cannot book this ticket. Contact our help line for more updates');
            }
            else {
                const response1 = await axios_1.default.request(PreBookticket);
                const response = await axios_1.default.request(Bookticket);
                return await this.flyHubUtil.bookingDataTransformerFlyhb(response.data, header, currentTimestamp, personIds);
            }
        }
        catch (error) {
            throw error;
        }
    }
    async airRetriveAdmin(BookingID) {
        const findBooking = await this.bookingSaveRepository.findOne({
            where: { bookingId: BookingID.BookingID },
            relations: ['user'],
        });
        const bookingId = await this.bookingIdSave.findOne({
            where: { flyitSearchId: BookingID.BookingID },
        });
        if (!bookingId) {
            throw new common_1.NotFoundException(`No Booking Found with ${BookingID.BookingID}`);
        }
        const flyhubId = bookingId.flyhubId;
        const token = await this.getToken();
        const ticketRetrive = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirRetrieve`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: { BookingID: flyhubId },
        };
        try {
            const response = await axios_1.default.request(ticketRetrive);
            return this.flyHubUtil.airRetriveDataTransformerAdmin(response?.data, BookingID.BookingID, findBooking.bookingStatus, findBooking.TripType, findBooking.bookingDate);
        }
        catch (error) {
            throw error?.response?.data;
        }
    }
    async convertToFlyAirSearchDto(flightSearchModel, userIp) {
        const segments = flightSearchModel.segments.map((segment) => ({
            Origin: segment.depfrom,
            Destination: segment.arrto,
            CabinClass: flightSearchModel.cabinclass,
            DepartureDateTime: segment.depdate,
        }));
        const journeyType = this.determineJourneyType(segments);
        const flyAirSearchDto = (0, class_transformer_1.plainToClass)(flyhub_model_1.FlyAirSearchDto, {
            AdultQuantity: flightSearchModel.adultcount,
            ChildQuantity: flightSearchModel.childcount,
            InfantQuantity: flightSearchModel.infantcount,
            EndUserIp: userIp,
            JourneyType: journeyType,
            Segments: segments,
        });
        try {
            return await this.searchFlights(flyAirSearchDto);
        }
        catch (error) {
            return error;
        }
    }
    determineJourneyType(segments) {
        if (segments.length === 1) {
            return '1';
        }
        if (segments.length === 2) {
            if (segments[0].Destination === segments[1].Origin &&
                segments[0].Origin === segments[1].Destination) {
                return '2';
            }
            return '3';
        }
        return '3';
    }
    async makeTicket(BookingID) {
        const findBooking = await this.bookingSaveRepository.findOne({
            where: { bookingId: BookingID.BookingID },
            relations: ['user'],
        });
        const bookingId = await this.bookingIdSave.findOne({
            where: { flyitSearchId: BookingID.BookingID },
        });
        if (!bookingId) {
            throw new common_1.NotFoundException(`No Booking Found with ${BookingID.BookingID}`);
        }
        const flyhubId = bookingId.flyhubId;
        const token = await this.getToken();
        const makeTicket = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/AirTicketing`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: {
                BookingID: flyhubId,
                IsAcceptedPriceChangeandIssueTicket: true
            },
        };
        try {
            const response = await axios_1.default.request(makeTicket);
            if (response.data.Results !== null) {
                return this.flyHubUtil.airRetriveDataTransformerAdmin(response?.data, BookingID.BookingID, findBooking.bookingStatus, findBooking.TripType, findBooking.bookingDate);
            }
            return response.data;
        }
        catch (error) {
            throw error?.response?.data;
        }
    }
};
exports.FlyHubService = FlyHubService;
exports.FlyHubService = FlyHubService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(flight_model_1.BookingIdSave)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_model_1.BookingSave)),
    __metadata("design:paramtypes", [flyhub_util_1.FlyHubUtil,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FlyHubService);
//# sourceMappingURL=flyhub.flight.service.js.map