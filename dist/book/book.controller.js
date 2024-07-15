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
exports.BookController = void 0;
const common_1 = require("@nestjs/common");
const book_service_1 = require("./book.service");
const book_model_1 = require("./book.model");
const swagger_1 = require("@nestjs/swagger");
const flyhub_flight_service_1 = require("../flight/API Utils/flyhub.flight.service");
const flyhub_model_1 = require("../flight/API Utils/Dto/flyhub.model");
const flyhub_util_1 = require("../flight/API Utils/flyhub.util");
let BookController = class BookController {
    constructor(fileupload, flyHubService, flyHubUtil) {
        this.fileupload = fileupload;
        this.flyHubService = flyHubService;
        this.flyHubUtil = flyHubUtil;
    }
    async airbook(data) {
        return this.flyHubService.airbook(data);
    }
    async aircanel(bookingIdDto) {
        return this.flyHubService.aircancel(bookingIdDto);
    }
    async airRetrive(bookingIdDto) {
        return await this.flyHubService.airRetrive(bookingIdDto);
    }
    async bookingtest(data) {
        return await this.flyHubUtil.bookingDataTransformerFlyhb(data);
    }
};
exports.BookController = BookController;
__decorate([
    (0, common_1.Post)('flh/air-book'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flyhub_model_1.FlbFlightSearchDto]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "airbook", null);
__decorate([
    (0, common_1.Post)('flh/cancel-ticket'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [book_model_1.BookingID]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "aircanel", null);
__decorate([
    (0, common_1.Post)('flh/air-retrive'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [book_model_1.BookingID]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "airRetrive", null);
__decorate([
    (0, common_1.Post)('testBooking'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "bookingtest", null);
exports.BookController = BookController = __decorate([
    (0, swagger_1.ApiTags)('Booking-Details'),
    (0, common_1.Controller)('book'),
    __metadata("design:paramtypes", [book_service_1.BookService,
        flyhub_flight_service_1.FlyHubService,
        flyhub_util_1.FlyHubUtil])
], BookController);
//# sourceMappingURL=book.controller.js.map