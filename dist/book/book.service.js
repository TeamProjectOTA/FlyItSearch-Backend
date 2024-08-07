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
exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_model_1 = require("./book.model");
const user_entity_1 = require("../user/entities/user.entity");
const auth_service_1 = require("../auth/auth.service");
let BookService = class BookService {
    constructor(saveBookingRepository, userRepository, authservice) {
        this.saveBookingRepository = saveBookingRepository;
        this.userRepository = userRepository;
        this.authservice = authservice;
    }
    async saveBooking(createSaveBookingDto, header) {
        const email = await this.authservice.decodeToken(header);
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('No Booking data available for the user');
        }
        let saveBooking = await this.saveBookingRepository.findOne({
            where: { bookingId: createSaveBookingDto.bookingId, user },
        });
        if (saveBooking) {
            saveBooking.bookingStatus = createSaveBookingDto.bookingStatus;
        }
        else {
            saveBooking = this.saveBookingRepository.create({
                ...createSaveBookingDto,
                user,
            });
        }
        return this.saveBookingRepository.save(saveBooking);
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_model_1.SaveBooking)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], BookService);
//# sourceMappingURL=book.service.js.map