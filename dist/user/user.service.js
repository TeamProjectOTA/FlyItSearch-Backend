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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const bcrypt = require("bcryptjs");
const deposit_model_1 = require("../deposit/deposit.model");
const transection_model_1 = require("../transection/transection.model");
const ip_model_1 = require("../ip/ip.model");
const booking_model_1 = require("../book/booking.model");
let UserService = class UserService {
    constructor(userRepository, transectionRepository, authservice, ipAddressRepository, bookingSaveRepository) {
        this.userRepository = userRepository;
        this.transectionRepository = transectionRepository;
        this.authservice = authservice;
        this.ipAddressRepository = ipAddressRepository;
        this.bookingSaveRepository = bookingSaveRepository;
    }
    async create(createUserDto) {
        let add = new user_entity_1.User();
        const userAlreadyExisted = await this.userRepository.findOne({
            where: { email: createUserDto.email },
            relations: ['wallet'],
        });
        if (userAlreadyExisted) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const passenger = await this.userRepository.find({
            order: { id: 'DESC' },
            take: 1,
        });
        let passengerId;
        if (passenger.length === 1) {
            const lastPassenger = passenger[0];
            const oldpassengerId = lastPassenger.passengerId.replace('FLYITP', '');
            passengerId = 'FLYITP' + (parseInt(oldpassengerId) + 1);
        }
        else {
            passengerId = 'FLYITP1000';
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        add.passengerId = passengerId;
        add.fullName = createUserDto.fullName.toUpperCase();
        add.phone = createUserDto.phone;
        add.email = createUserDto.email;
        add.role = 'registered';
        add.status = 'ACTIVE';
        add.password = hashedPassword;
        add.verificationToken = verificationToken;
        const newWallet = new deposit_model_1.Wallet();
        newWallet.ammount = 0;
        add.wallet = newWallet;
        const user = await this.userRepository.save(add);
        await this.authservice.sendVerificationEmail(user.email, verificationToken);
        return {
            fullName: user.fullName,
            phone: user.phone,
            email: user.email,
            message: `Please verify your email. An varification mail code has been sent to ${user.email}`,
        };
    }
    async update(header, updateUserDto) {
        const verifyUserToken = await this.authservice.verifyUserToken(header);
        if (!verifyUserToken) {
            throw new common_1.UnauthorizedException();
        }
        const email = await this.authservice.decodeToken(header);
        const updateUser = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!updateUser) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.email && updateUserDto.email !== updateUser.email) {
            const findEmail = await this.userRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (findEmail) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        Object.assign(updateUser, {
            fullName: updateUserDto?.fullName?.toUpperCase() || updateUser.fullName,
            phone: updateUserDto?.phone || updateUser.phone,
            email: updateUserDto?.email || updateUser.email,
            dob: updateUserDto?.dob || updateUser.dob,
            nationility: updateUserDto?.nationility || updateUser.nationility,
            password: updateUserDto?.password || updateUser.password,
            gender: updateUserDto?.gender || updateUser.gender,
            passport: updateUserDto?.passport || updateUser.passport,
            passportexp: updateUserDto?.passportexp || updateUser.passportexp,
        });
        const isEmailUpdated = updateUserDto?.email && updateUserDto.email !== email;
        if (isEmailUpdated) {
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            updateUser.verificationToken = verificationToken;
            updateUser.emailVerified = false;
            await this.authservice.sendVerificationEmail(updateUser.email, verificationToken);
        }
        await this.userRepository.save(updateUser);
        const userResponse = {
            id: updateUser.id,
            fullName: updateUser.fullName,
            email: updateUser.email,
            phone: updateUser.phone,
            dob: updateUser.dob,
            nationility: updateUser.nationility,
            gender: updateUser.gender,
            passport: updateUser.passport,
            passportexp: updateUser.passportexp,
        };
        return userResponse;
    }
    async allUser(header, page = 1, limit = 10) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        const pageNumber = Math.max(1, page);
        const limitNumber = Math.max(1, limit);
        const offset = (pageNumber - 1) * limitNumber;
        const [users, total] = await this.userRepository.findAndCount({
            skip: offset,
            take: limitNumber,
            order: { id: 'DESC' },
        });
        return {
            data: users,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        };
    }
    async findUserWithBookings(header, bookingStatus, page = 1, limit = 10) {
        const pageNumber = Math.max(1, page);
        const limitNumber = limit > 0 ? limit : 10;
        const offset = (pageNumber - 1) * limitNumber;
        const verifyUser = await this.authservice.verifyUserToken(header);
        if (!verifyUser) {
            throw new common_1.UnauthorizedException();
        }
        const email = await this.authservice.decodeToken(header);
        const [bookings, total] = await this.bookingSaveRepository
            .createQueryBuilder('bookingSave')
            .innerJoin('bookingSave.user', 'user')
            .where('user.email = :email', { email })
            .andWhere('LOWER(bookingSave.bookingStatus) = LOWER(:bookingStatus)', {
            bookingStatus,
        })
            .orderBy('bookingSave.id', 'DESC')
            .skip(offset)
            .take(limitNumber)
            .getManyAndCount();
        if (!bookings || bookings.length === 0) {
            throw new common_1.NotFoundException(`No ${bookingStatus} available for the user`);
        }
        const filteredBookings = bookings.map((booking) => ({
            id: booking.id,
            system: booking.system,
            bookingId: booking.bookingId,
            paxCount: booking.paxCount,
            Curriername: booking.Curriername,
            CurrierCode: booking.CurrierCode,
            flightNumber: booking.flightNumber,
            isRefundable: booking.isRefundable,
            bookingDate: booking.bookingDate,
            expireDate: booking.expireDate,
            bookingStatus: booking.bookingStatus,
            TripType: booking.TripType,
            grossAmmount: booking.grossAmmount,
            netAmmount: booking.netAmmount,
            laginfo: booking.laginfo,
            personId: booking.personId,
        }));
        return {
            bookings: filteredBookings,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        };
    }
    async findAllUserWithBookings(page, limit) {
        const offset = (page - 1) * limit;
        const [users, total] = await this.userRepository.findAndCount({
            relations: ['bookingSave', 'wallet'],
            order: {
                passengerId: 'DESC',
            },
            take: limit,
            skip: offset,
        });
        const usersWithIpData = await Promise.all(users.map(async (user) => {
            const emaildata = user.email;
            const ip = await this.ipAddressRepository.findOne({
                where: { email: emaildata },
            });
            const searchCount = 50 - (ip?.points || 0);
            return {
                ...user,
                searchCount,
            };
        }));
        return {
            data: usersWithIpData,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOneUser(header) {
        const email = await this.authservice.decodeToken(header);
        const user = await this.userRepository.findOne({
            where: { email: email },
            relations: ['profilePicture', 'wallet'],
        });
        const nameParts = user.fullName.split(' ');
        let firstName = '';
        let lastName = '';
        if (nameParts.length > 0) {
            firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
        }
        if (nameParts.length > 1) {
            lastName =
                nameParts.slice(1).join(' ').charAt(0).toUpperCase() +
                    nameParts.slice(1).join(' ').slice(1);
        }
        return {
            firstName: firstName,
            lastName: lastName,
            gender: user.gender,
            dob: user.dob,
            nationality: user.nationility,
            passport: user.passport,
            passportExpiryDate: user.passportexp,
            email: user.email,
            phone: user.phone,
            profilePicture: user.profilePicture,
            wallet: user.wallet,
        };
    }
    async findUserTravelBuddy(header, page = 1, limit = 10) {
        const verifyUser = await this.authservice.verifyUserToken(header);
        if (!verifyUser) {
            throw new common_1.UnauthorizedException();
        }
        const pageNumber = Math.max(1, page);
        const limitNumber = Math.max(1, limit);
        const offset = (pageNumber - 1) * limitNumber;
        const email = await this.authservice.decodeToken(header);
        const [travelBuddies, total] = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.travelBuddy', 'travelBuddy')
            .where('user.email = :email', { email })
            .orderBy('travelBuddy.id', 'DESC')
            .skip(offset)
            .take(limitNumber)
            .getManyAndCount();
        if (!travelBuddies || travelBuddies.length === 0) {
            throw new common_1.NotFoundException(`No Travel Buddies available for the user`);
        }
        return {
            travelBuddies,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        };
    }
    async findUserTransactions(header, page = 1, limit = 10) {
        const email = await this.authservice.decodeToken(header);
        const pageNumber = Math.max(1, page);
        const limitNumber = Math.max(1, limit);
        const offset = (pageNumber - 1) * limitNumber;
        const [transactions, total] = await this.transectionRepository
            .createQueryBuilder('transection')
            .innerJoin('transection.user', 'user')
            .where('user.email = :email', { email })
            .orderBy('transection.id', 'DESC')
            .skip(offset)
            .take(limitNumber)
            .select([
            'transection.id',
            'transection.tranId',
            'transection.tranDate',
            'transection.bookingId',
            'transection.offerAmmount',
            'transection.status',
            'transection.requestType',
            'transection.paymentType',
            'transection.refundAmount',
        ])
            .getManyAndCount();
        return {
            transactions,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        };
    }
    async allTransection(page = 1, limit = 10) {
        const pageNumber = Math.max(1, page);
        const limitNumber = Math.max(1, limit);
        const offset = (pageNumber - 1) * limitNumber;
        const [transection, total] = await this.transectionRepository.findAndCount({
            relations: ['user', 'user.wallet'],
            order: { id: 'DESC' },
            skip: offset,
            take: limitNumber,
        });
        return {
            transection,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        };
    }
    async updateUserActivation(email, action) {
        let user = await this.userRepository.findOne({ where: { email: email } });
        user.status = action;
        return await this.userRepository.save(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(transection_model_1.Transection)),
    __param(3, (0, typeorm_1.InjectRepository)(ip_model_1.IpAddress)),
    __param(4, (0, typeorm_1.InjectRepository)(booking_model_1.BookingSave)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map