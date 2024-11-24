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
const admin_dashboard_model_1 = require("./admin-dashboard.model");
let AdminDashboardService = class AdminDashboardService {
    constructor(bookingSaveRepository, depositRepository, newTicketRepository) {
        this.bookingSaveRepository = bookingSaveRepository;
        this.depositRepository = depositRepository;
        this.newTicketRepository = newTicketRepository;
    }
    async findAll(initialDate, endDate) {
        const startOfDay = new Date(initialDate).toISOString();
        const endOfDay = new Date(endDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const endOfDayISO = endOfDay.toISOString();
        const allDeposit = await this.depositRepository.find({
            where: {
                createdAt: (0, typeorm_2.Between)(initialDate, endDate),
            },
        });
        const allBookings = await this.bookingSaveRepository.find({
            where: {
                bookingDate: (0, typeorm_2.Between)(startOfDay, endOfDayISO),
            },
        });
        const pending = allDeposit.filter((deposit) => deposit.status == 'Pending').length;
        const depositAmount = allDeposit.filter((deposit) => deposit.status == 'Approved');
        const totalAmount = depositAmount.reduce((sum, deposit) => sum + deposit.ammount, 0);
        const requestTicket = allBookings.filter((booking) => booking.bookingStatus === 'IssueInProcess').length;
        const booked = allBookings.filter((booking) => booking.bookingStatus === 'Booked').length;
        const cancelled = allBookings.filter((booking) => booking.bookingStatus === 'Cancelled').length;
        const ticketed = allBookings.filter((booking) => booking.bookingStatus === 'Ticketed').length;
        const flight = await this.bookingSaveRepository.find();
        const todayFly = flight.filter((entry) => entry.laginfo[0].DepDate.startsWith(initialDate)).length;
        const tomorrowDate = new Date(initialDate);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrowDateString = tomorrowDate.toISOString().split('T')[0];
        const tomorrowFly = flight.filter((entry) => entry.laginfo[0].DepDate.startsWith(tomorrowDateString)).length;
        const dayAfterTomorrowDate = new Date(initialDate);
        dayAfterTomorrowDate.setDate(dayAfterTomorrowDate.getDate() + 2);
        const dayAfterTomorrowString = dayAfterTomorrowDate.toISOString().split('T')[0];
        const dayAfterTomorrowFly = flight.filter((entry) => entry.laginfo[0].DepDate.startsWith(dayAfterTomorrowString)).length;
        return {
            Booking: {
                IssueInProcess: requestTicket,
                Booked: booked,
                Cancelled: cancelled,
                Ticketed: ticketed,
                TodayFly: todayFly,
                TomorrowFly: tomorrowFly,
                DayAfterTomorrowFly: dayAfterTomorrowFly,
            },
            Deposit: {
                pending: pending,
                TotalDeposit: totalAmount,
            },
        };
    }
    async vendorMakeTicket(ticketDataDTO) {
        const booking = await this.bookingSaveRepository.findOne({ where: { bookingId: ticketDataDTO.bookingId } });
        if (!booking) {
            throw new common_1.NotFoundException();
        }
        booking.PNR = ticketDataDTO.airlinesPNR;
        booking.bookingData[0].System = 'FLYHUB';
        booking.bookingStatus = 'Ticketed';
        booking.bookingData[0].GDSPNR = booking.bookingData[0].PNR;
        booking.bookingData[0].PNR = ticketDataDTO.airlinesPNR;
        const mappedPassengerList = booking.bookingData[0].PassengerList.map((passenger, index) => {
            return {
                ...passenger,
                Ticket: ticketDataDTO.ticketNumber[index]
                    ? [{ TicketNo: ticketDataDTO.ticketNumber[index].eticket.toString() }]
                    : [{ TicketNo: null }]
            };
        });
        booking.bookingData[0].PassengerList = mappedPassengerList;
        console.log(await this.bookingSaveRepository.save(booking));
        return booking;
    }
    async findAllTickets() {
        return await this.newTicketRepository.find();
    }
};
exports.AdminDashboardService = AdminDashboardService;
exports.AdminDashboardService = AdminDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_model_1.BookingSave)),
    __param(1, (0, typeorm_1.InjectRepository)(deposit_model_1.Deposit)),
    __param(2, (0, typeorm_1.InjectRepository)(admin_dashboard_model_1.NewTicket)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminDashboardService);
//# sourceMappingURL=admin-dashboard.service.js.map