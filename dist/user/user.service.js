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
let UserService = class UserService {
    constructor(userRepository, authservice) {
        this.userRepository = userRepository;
        this.authservice = authservice;
    }
    async create(createUserDto) {
        let add = new user_entity_1.User();
        const userAlreadyExisted = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (userAlreadyExisted) {
            throw new common_1.HttpException('User already existed', common_1.HttpStatus.BAD_REQUEST);
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
        add.passengerId = passengerId;
        add.fullName = createUserDto.fullName.toUpperCase();
        add.phone = createUserDto.phone;
        add.email = createUserDto.email;
        add.role = 'registered';
        add.password = hashedPassword;
        return this.userRepository.save(add);
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
            throw new common_1.NotFoundException();
        }
        if (updateUserDto.password) {
            const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
            updateUser.password = hashedPassword;
        }
        if (updateUserDto.email) {
            const findEmail = await this.userRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (findEmail) {
                throw new common_1.ConflictException('Email already existed');
            }
        }
        updateUser.fullName = updateUserDto.fullName;
        updateUser.email = updateUserDto.email;
        return await this.userRepository.save(updateUser);
    }
    async allUser(header) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        return await this.userRepository.find();
    }
    async findUserWithBookings(header) {
        const verifyUser = await this.authservice.verifyUserToken(header);
        if (!verifyUser) {
            throw new common_1.UnauthorizedException();
        }
        const email = await this.authservice.decodeToken(header);
        const updateUser = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!updateUser) {
            throw new common_1.NotFoundException('No Booking data Avilable for the user');
        }
        return this.userRepository.findOne({
            where: { email },
            relations: ['saveBookings', 'saveBookings.laginfo'],
        });
    }
    async findAllUserWithBookings(header) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        return this.userRepository.find({
            relations: ['saveBookings', 'saveBookings.laginfo'],
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], UserService);
//# sourceMappingURL=user.service.js.map