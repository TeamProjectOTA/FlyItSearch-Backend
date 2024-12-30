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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const booking_model_1 = require("./booking.model");
const swagger_1 = require("@nestjs/swagger");
const flyhub_flight_service_1 = require("../flight/API Utils/flyhub.flight.service");
const flyhub_model_1 = require("../flight/API Utils/Dto/flyhub.model");
const user_tokens_guard_1 = require("../auth/user-tokens.guard");
const admin_tokens_guard_1 = require("../auth/admin.tokens.guard");
const bdfare_flights_service_1 = require("../flight/API Utils/bdfare.flights.service");
let BookingController = class BookingController {
    constructor(bookingService, flyHubService, bdfareService) {
        this.bookingService = bookingService;
        this.flyHubService = flyHubService;
        this.bdfareService = bdfareService;
    }
    async airbook(data, header, request) {
        const nowdate = new Date(Date.now());
        const dhakaOffset = 6 * 60 * 60 * 1000;
        const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
        const dhakaTimeFormatted = dhakaTime.toISOString();
        let userIp = request.ip;
        if (userIp.startsWith('::ffff:')) {
            userIp = userIp.split(':').pop();
        }
        const { Passengers } = data;
        const personIds = [];
        Passengers.forEach((passenger, index) => {
            const personData = {
                index: index + 1,
            };
            if (passenger.visa) {
                personData.visa = passenger.visa;
            }
            if (passenger.passport) {
                personData.passport = passenger.passport;
            }
            personIds.push(personData);
            delete passenger.visa;
            delete passenger.passport;
        });
        return await this.flyHubService.airbook(data, header, dhakaTimeFormatted, personIds, userIp);
    }
    async aircanel(bookingIdDto, header) {
        return await this.flyHubService.aircancel(bookingIdDto, header);
    }
    async airRetrive(bookingIdDto, header, request) {
        let userIp = request.ip;
        if (userIp.startsWith('::ffff:')) {
            userIp = userIp.split(':').pop();
        }
        return await this.flyHubService.airRetrive(bookingIdDto, header, userIp);
    }
    async bdfCancel(bookingIdDto) {
        return await this.bdfareService.flightBookingCancel(bookingIdDto);
    }
    async airRetriveBDF(bookingIdDto) {
        return await this.bdfareService.flightRetrieve(bookingIdDto);
    }
    async airRetriveAdmin(bookingIdDto) {
        return await this.flyHubService.airRetriveAdmin(bookingIdDto);
    }
    async findAll(bookingStatus, page, limit) {
        return await this.bookingService.findAllBooking(bookingStatus, page, limit);
    }
    async findUserWithBookings(header, bookingStatus) {
        return this.bookingService.findUserWithBookings(header, bookingStatus);
    }
    async ticketMake(bookingIdDto) {
        return await this.flyHubService.makeTicket(bookingIdDto);
    }
    async bdfareBook(bookingdto, header) {
        const nowdate = new Date(Date.now());
        const dhakaOffset = 6 * 60 * 60 * 1000;
        const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
        const dhakaTimeFormatted = dhakaTime.toISOString();
        const { Passengers } = bookingdto;
        const personIds = [];
        Passengers.forEach((passenger, index) => {
            const personData = {
                index: index + 1,
            };
            if (passenger.visa) {
                personData.visa = passenger.visa;
            }
            if (passenger.passport) {
                personData.passport = passenger.passport;
            }
            personIds.push(personData);
            delete passenger.visa;
            delete passenger.passport;
        });
        return await this.bdfareService.flightBooking(bookingdto, header, dhakaTimeFormatted, personIds);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('flh/airBook/'),
    (0, swagger_1.ApiBody)({ type: flyhub_model_1.FlbFlightSearchDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flyhub_model_1.FlbFlightSearchDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "airbook", null);
__decorate([
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('flh/cancelBooking'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_model_1.BookingID, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "aircanel", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('flh/airRetrive'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_model_1.BookingID, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "airRetrive", null);
__decorate([
    (0, common_1.Post)('bdfare/cancelBooking'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_model_1.BookingID]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "bdfCancel", null);
__decorate([
    (0, common_1.Post)('bdfare/airRetrive'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_model_1.BookingID]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "airRetriveBDF", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, common_1.Post)('admin/flh/airRetrive'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_model_1.BookingID]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "airRetriveAdmin", null);
__decorate([
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 10)',
    }),
    (0, common_1.Get)('admin/allBooking/:bookingStatus'),
    __param(0, (0, common_1.Param)('bookingStatus')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Get)('/user/:bookingStatus'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('bookingStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "findUserWithBookings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('flh/makeTicket'),
    (0, common_1.UseGuards)(admin_tokens_guard_1.AdmintokenGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_model_1.BookingID]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "ticketMake", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('api2/booking'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_model_1.BookingDataDto, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "bdfareBook", null);
exports.BookingController = BookingController = __decorate([
    (0, swagger_1.ApiTags)('Booking-Details'),
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService,
        flyhub_flight_service_1.FlyHubService,
        bdfare_flights_service_1.BDFareService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map