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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_model_1 = require("./booking.model");
const user_entity_1 = require("../user/entities/user.entity");
const auth_service_1 = require("../auth/auth.service");
let BookingService = class BookingService {
    constructor(userRepository, authservice, bookingSaveRepository) {
        this.userRepository = userRepository;
        this.authservice = authservice;
        this.bookingSaveRepository = bookingSaveRepository;
    }
    async saveBooking(createSaveBookingDto, header) {
        const email = await this.authservice.decodeToken(header);
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('No Booking data available for the user');
        }
        let saveBooking = await this.bookingSaveRepository.findOne({
            where: { bookingId: createSaveBookingDto.bookingId, user },
        });
        if (saveBooking) {
            saveBooking.bookingStatus = createSaveBookingDto.bookingStatus;
        }
        else {
            saveBooking = this.bookingSaveRepository.create({
                ...createSaveBookingDto,
                user,
            });
        }
        return await this.bookingSaveRepository.save(saveBooking);
    }
    async cancelDataSave(fsid, status, header) {
        const email = await this.authservice.decodeToken(header);
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('No Booking data available for the user');
        }
        let saveBooking = await this.bookingSaveRepository.findOne({
            where: { bookingId: fsid, user },
        });
        saveBooking.bookingStatus = status;
        saveBooking.actionBy = user.fullName;
        const nowdate = new Date(Date.now());
        const dhakaOffset = 6 * 60 * 60 * 1000;
        const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
        const dhakaTimeFormatted = dhakaTime.toISOString();
        saveBooking.actionAt = dhakaTimeFormatted;
        return await this.bookingSaveRepository.save(saveBooking);
    }
    async findAllBooking(bookingStatus) {
        if (bookingStatus !== 'all') {
            return await this.bookingSaveRepository.find({
                where: { bookingStatus: bookingStatus },
                relations: ['user'],
                order: { bookingDate: 'DESC' },
            });
        }
        else {
            return await this.bookingSaveRepository.find({
                relations: ['user'],
                order: { bookingDate: 'DESC' },
            });
        }
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_model_1.BookingSave)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService,
        typeorm_2.Repository])
], BookingService);
//# sourceMappingURL=booking.service.js.map