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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_entity_1 = require("./entities/admin.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const auth_service_1 = require("../auth/auth.service");
const uuid_1 = require("uuid");
const agents_entity_1 = require("../agents/entities/agents.entity");
const booking_model_1 = require("../book/booking.model");
const transection_model_1 = require("../transection/transection.model");
let AdminService = class AdminService {
    constructor(adminRepository, userRepository, agentRepository, bookingSaveRepository, transectionRepository, authservice) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.agentRepository = agentRepository;
        this.bookingSaveRepository = bookingSaveRepository;
        this.transectionRepository = transectionRepository;
        this.authservice = authservice;
    }
    async create(createAdminDto, header) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        const email = await this.authservice.decodeToken(header);
        const adminFind = await this.adminRepository.findOne({
            where: { email: email },
        });
        if (adminFind.role != 'superAdmin') {
            throw new common_1.UnauthorizedException(`You are not permitted to create an admin account ${adminFind.firstName} ${adminFind.lastName}`);
        }
        const adminAllReadyExisted = await this.adminRepository.findOne({
            where: { email: createAdminDto.email },
        });
        if (adminAllReadyExisted) {
            throw new common_1.HttpException('Admin already existed', common_1.HttpStatus.BAD_REQUEST);
        }
        let add = new admin_entity_1.Admin();
        const admin = await this.adminRepository.find({
            order: { id: 'DESC' },
            take: 1,
        });
        let adminId;
        if (admin.length === 1) {
            const lastAdmin = admin[0];
            const oldAdminId = lastAdmin.adminid.replace('FLYIT', '');
            adminId = 'FLYIT' + (parseInt(oldAdminId) + 1);
        }
        else {
            adminId = 'FLYIT1000';
        }
        add.adminid = adminId;
        add.firstName = createAdminDto.firstName;
        add.lastName = createAdminDto.lastName;
        add.email = createAdminDto.email;
        add.phone = createAdminDto.phone;
        add.password = createAdminDto.password;
        add.role = createAdminDto.role;
        add.status = createAdminDto.status;
        add.created_at = new Date();
        add.updated_at = new Date();
        add.uuid = (0, uuid_1.v4)();
        return await this.adminRepository.save(add);
    }
    async findAll(header) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        const email = await this.authservice.decodeToken(header);
        const adminFind = await this.adminRepository.findOne({
            where: { email: email },
        });
        if (adminFind.role != 'superAdmin') {
            throw new common_1.UnauthorizedException(`You are not permitted to create an admin account ${adminFind.firstName} ${adminFind.lastName}`);
        }
        return await this.adminRepository.find({ order: { id: 'DESC' } });
    }
    async findOne(header, uuid) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        let findAdmin = await this.adminRepository.findOne({
            where: { uuid: uuid },
        });
        if (!findAdmin) {
            throw new common_1.NotFoundException();
        }
        return findAdmin;
    }
    async findOneUser(passengerId, header) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        const finduser = await this.userRepository.findOne({
            where: { passengerId: passengerId },
        });
        if (!finduser) {
            throw new common_1.NotFoundException();
        }
        return finduser;
    }
    async update(header, updateAdminDto, uuid) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        const updateAdmin = await this.adminRepository.findOne({
            where: { uuid: uuid },
        });
        if (!updateAdmin) {
            throw new common_1.NotFoundException();
        }
        if (updateAdminDto.email && updateAdminDto.email !== updateAdmin.email) {
            const emailExisted = await this.adminRepository.findOne({
                where: { email: updateAdminDto.email },
            });
            if (emailExisted) {
                throw new common_1.BadRequestException('Email already exists. Please enter another email.');
            }
        }
        updateAdmin.firstName = updateAdminDto.firstName;
        updateAdmin.lastName = updateAdminDto.lastName;
        updateAdmin.email = updateAdminDto.email;
        updateAdmin.phone = updateAdminDto.phone;
        updateAdmin.password = updateAdminDto.password;
        updateAdmin.status = updateAdminDto.status;
        updateAdmin.updated_at = new Date();
        return await this.adminRepository.save(updateAdmin);
    }
    async remove(header, uuid) {
        const verifyAdminId = await this.authservice.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const decodedToken = await this.authservice.decodeToken(header);
        if (uuid == decodedToken) {
            throw new common_1.UnauthorizedException('You can not delete your self');
        }
        const adminToFind = await this.adminRepository.findOne({
            where: { uuid: uuid },
        });
        const adminToDelete = await this.adminRepository.delete({
            uuid: uuid,
        });
        return { adminToFind, adminToDelete };
    }
    async removeUser(passengerId, header) {
        const verifyAdminId = await this.authservice.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const userToFind = await this.userRepository.findOne({
            where: { passengerId: passengerId },
        });
        const userToDelete = await this.userRepository.delete({
            passengerId: passengerId,
        });
        return { userToFind, userToDelete };
    }
    async allbooking() {
        return await this.bookingSaveRepository.find();
    }
    async ticketCancel(bookingId, reason, header) {
        const email = await this.authservice.decodeToken(header);
        const admin = await this.adminRepository.findOne({
            where: { email: email },
        });
        const booking = await this.bookingSaveRepository.findOne({
            where: { bookingId: bookingId },
            relations: ['user'],
        });
        const wallet = await this.userRepository.findOne({
            where: { email: booking.user.email },
            relations: ['wallet'],
        });
        const timestamp = Date.now();
        const randomNumber = Math.floor(Math.random() * 1000);
        const tran_id = `SSM${timestamp}${randomNumber}`;
        const nowdate = new Date(Date.now());
        const dhakaOffset = 6 * 60 * 60 * 1000;
        const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
        const dhakaTimeFormatted = dhakaTime.toISOString();
        const arrto = booking.laginfo[0].ArrTo;
        const depfrom = booking.laginfo[0].DepFrom;
        const tripType = booking.TripType;
        let add = new transection_model_1.Transection();
        add.tranId = tran_id;
        add.bookingId = bookingId;
        add.user = wallet;
        add.paymentType = 'FlyIt Wallet';
        add.requestType = `${depfrom}-${arrto},${tripType} Air Ticket `;
        add.currierName = booking.Curriername;
        add.validationDate = dhakaTimeFormatted;
        add.tranDate = dhakaTimeFormatted;
        add.paidAmount = Number(booking.netAmmount);
        add.offerAmmount = Number(booking.netAmmount);
        add.riskTitle = 'Safe';
        add.cardType = 'Adjusted Money Added';
        add.status = 'Adjusted';
        add.walletBalance = wallet.wallet.ammount + Number(booking.netAmmount);
        wallet.wallet.ammount = wallet.wallet.ammount + Number(booking.netAmmount);
        booking.bookingStatus = 'Cancelled';
        booking.reason = reason;
        booking.actionBy = `${admin.firstName} ${admin.lastName}`;
        booking.actionAt = dhakaTimeFormatted;
        await this.userRepository.save(wallet);
        await this.bookingSaveRepository.save(booking);
        return await this.transectionRepository.save(add);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(agents_entity_1.Agents)),
    __param(3, (0, typeorm_1.InjectRepository)(booking_model_1.BookingSave)),
    __param(4, (0, typeorm_1.InjectRepository)(transection_model_1.Transection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], AdminService);
//# sourceMappingURL=admin.service.js.map