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
exports.AdminDashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_model_1 = require("../book/booking.model");
const typeorm_2 = require("typeorm");
const deposit_model_1 = require("../deposit/deposit.model");
let AdminDashboardService = class AdminDashboardService {
    constructor(bookingSaveRepository, depositRepository) {
        this.bookingSaveRepository = bookingSaveRepository;
        this.depositRepository = depositRepository;
    }
    async findAll(depositDate) {
        const datePattern = `${depositDate}%`;
        const allDeposit = await this.depositRepository.find({
            where: {
                createdAt: (0, typeorm_2.Like)(datePattern)
            }
        });
        const allBookings = await this.bookingSaveRepository.find({
            where: {
                bookingDate: (0, typeorm_2.Like)(datePattern),
            },
        });
        const pending = (allDeposit.filter(deposit => deposit.status == 'Pending')).length;
        const depositAmmount = allDeposit.filter(deposit => deposit.status == 'Approved');
        const totalAmount = depositAmmount.reduce((sum, deposit) => sum + deposit.ammount, 0);
        const requestTicket = allBookings.filter(booking => booking.bookingStatus === 'IssueInProcess').length;
        const booked = allBookings.filter(booking => booking.bookingStatus === 'Booked').length;
        const cancelled = allBookings.filter(booking => booking.bookingStatus === 'Cancelled').length;
        const ticketed = allBookings.filter(booking => booking.bookingStatus === 'Ticketed').length;
        const flight = await this.bookingSaveRepository.find({
            where: {
                laginfo: (0, typeorm_2.Raw)(alias => `JSON_EXTRACT(${alias}, '$[0].DepDate') LIKE :datePattern`, { datePattern: `${depositDate}%` })
            }
        });
        return {
            Booking: { IssueInProcess: requestTicket,
                Booked: booked,
                Cancelled: cancelled,
                Ticketed: ticketed,
                Flydetails: flight,
            },
            Deposit: { pending: pending,
                TotalDeposit: totalAmount },
        };
    }
};
exports.AdminDashboardService = AdminDashboardService;
exports.AdminDashboardService = AdminDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_model_1.BookingSave)),
    __param(1, (0, typeorm_1.InjectRepository)(deposit_model_1.Deposit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminDashboardService);
//# sourceMappingURL=admin-dashboard.service.js.map