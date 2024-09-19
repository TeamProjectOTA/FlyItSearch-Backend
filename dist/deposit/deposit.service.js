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
exports.DepositService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const deposit_model_1 = require("./deposit.model");
const typeorm_2 = require("@nestjs/typeorm");
const auth_service_1 = require("../auth/auth.service");
const transection_model_1 = require("../transection/transection.model");
let DepositService = class DepositService {
    constructor(depositRepository, userRepository, walletRepository, transectionRepository, authService) {
        this.depositRepository = depositRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transectionRepository = transectionRepository;
        this.authService = authService;
    }
    async createDeposit(depositData, header) {
        const email = await this.authService.decodeToken(header);
        const user = await this.userRepository.findOne({ where: { email: email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const random_id = `SSMD${timestamp}${randomNumber}`;
        const nowdate = new Date(Date.now());
        const dhakaOffset = 6 * 60 * 60 * 1000;
        const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
        const dhakaTimeFormatted = dhakaTime.toISOString();
        const deposit = this.depositRepository.create({
            ...depositData,
            depositId: random_id,
            createdAt: dhakaTimeFormatted,
            status: 'Pending',
            user,
        });
        return await this.depositRepository.save(deposit);
    }
    async getDepositforUser(header) {
        const email = await this.authService.decodeToken(header);
        const userWithDeposits = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.deposit', 'deposit')
            .where('user.email = :email', { email })
            .orderBy('deposit.id', 'DESC')
            .getOne();
        if (!userWithDeposits) {
            throw new common_1.NotFoundException('User not found');
        }
        return userWithDeposits.deposit;
    }
    async findAllDeposit() {
        return this.depositRepository.find({
            order: { id: 'DESC' },
            relations: ['user'],
        });
    }
    async updateDepositStatus(depositId, updateData) {
        const deposit = await this.depositRepository.findOne({
            where: { depositId: depositId },
            relations: ['user'],
        });
        const userEmail = deposit.user.email;
        if (!deposit) {
            throw new common_1.NotFoundException('Deposit not found');
        }
        if (deposit.actionAt) {
            throw new common_1.ConflictException(`The action was already taken at ${deposit.actionAt}`);
        }
        const nowdate = new Date(Date.now());
        const dhakaOffset = 6 * 60 * 60 * 1000;
        const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
        const dhakaTimeFormatted = dhakaTime.toISOString();
        deposit.status = updateData.status;
        deposit.actionAt = dhakaTimeFormatted;
        deposit.rejectionReason = updateData.rejectionReason;
        if (updateData.status == 'Approved') {
            let addTransection = new transection_model_1.Transection();
            addTransection.tranId = deposit.depositId;
            addTransection.user = deposit.user;
            addTransection.tranDate = moment.utc(deposit.createdAt).format('YYYY-MM-DD HH:mm:ss');
            addTransection.requestType = `${deposit.depositType} Transfar`;
            addTransection.bankTranId = deposit.referance;
            addTransection.paidAmount = deposit.ammount.toString();
            addTransection.status = 'Deposited';
            addTransection.riskTitle = 'Checked OK';
            addTransection.validationDate = moment.utc(deposit.actionAt).format('YYYY-MM-DD HH:mm:ss');
            await this.transectionRepository.save(addTransection);
            const findUser = await this.userRepository.findOne({
                where: { email: userEmail },
                relations: ['wallet'],
            });
            findUser.wallet.ammount = findUser.wallet.ammount + deposit.ammount;
            await this.walletRepository.save(findUser.wallet);
        }
        return await this.depositRepository.save(deposit);
    }
    async wallet(header) {
        const email = await this.authService.decodeToken(header);
        const wallet = await this.userRepository.findOne({
            where: { email: email },
            relations: ['wallet'],
        });
        return wallet.wallet;
    }
};
exports.DepositService = DepositService;
exports.DepositService = DepositService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(deposit_model_1.Deposit)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_2.InjectRepository)(deposit_model_1.Wallet)),
    __param(3, (0, typeorm_2.InjectRepository)(transection_model_1.Transection)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        auth_service_1.AuthService])
], DepositService);
//# sourceMappingURL=deposit.service.js.map