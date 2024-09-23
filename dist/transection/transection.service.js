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
exports.TransectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
const booking_model_1 = require("../book/booking.model");
const typeorm_2 = require("typeorm");
const transection_model_1 = require("./transection.model");
const user_entity_1 = require("../user/entities/user.entity");
const deposit_model_1 = require("../deposit/deposit.model");
let TransectionService = class TransectionService {
    constructor(authService, bookingRepository, userRepository, walletRepository, transectionRepoistory) {
        this.authService = authService;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transectionRepoistory = transectionRepoistory;
    }
    async paymentWithWallet(header, transectiondto) {
        const email = await this.authService.decodeToken(header);
        let wallet = await this.walletRepository
            .createQueryBuilder('wallet')
            .innerJoinAndSelect('wallet.user', 'user')
            .where('user.email = :email', { email })
            .getOne();
        const booking = await this.bookingRepository.findOne({ where: { bookingId: transectiondto.bookingId } });
        if (!booking) {
            throw new common_1.NotFoundException(`No booking found with  this ${transectiondto.bookingId} id`);
        }
        if (wallet.ammount < transectiondto.paidAmount) {
            return 'Low Balance';
        }
        const user = await this.userRepository.findOne({ where: { email: email } });
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const tran_id = `SSM${timestamp}${randomNumber}`;
        const nowdate = new Date(Date.now());
        const dhakaOffset = 6 * 60 * 60 * 1000;
        const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
        const dhakaTimeFormatted = dhakaTime.toISOString();
        let add = new transection_model_1.Transection();
        add.tranId = tran_id;
        add.bookingId = transectiondto.bookingId;
        add.user = user;
        add.paymentType = 'FlyIt Wallet';
        add.requestType = ' air ticket';
        add.currierName = transectiondto.currierName;
        add.validationDate = dhakaTimeFormatted;
        add.tranDate = dhakaTimeFormatted;
        add.paidAmount = transectiondto.paidAmount.toString();
        add.offerAmmount = transectiondto.offerAmmount;
        add.riskTitle = 'Safe';
        add.cardType = 'Deducted from Deposit';
        add.status = 'Purches';
        add.currierName = transectiondto.currierName;
        add.walletBalance = wallet.ammount - transectiondto.paidAmount;
        wallet.ammount = add.walletBalance;
        await this.walletRepository.save(wallet);
        return await this.transectionRepoistory.save(add);
    }
};
exports.TransectionService = TransectionService;
exports.TransectionService = TransectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(booking_model_1.BookingSave)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(deposit_model_1.Wallet)),
    __param(4, (0, typeorm_1.InjectRepository)(transection_model_1.Transection)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TransectionService);
//# sourceMappingURL=transection.service.js.map