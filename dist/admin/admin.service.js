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
let AdminService = class AdminService {
    constructor(adminRepository, userRepository, agentRepository, authservice) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.agentRepository = agentRepository;
        this.authservice = authservice;
    }
    async create(createAdminDto, header) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
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
        return await this.adminRepository.find();
    }
    async findOne(header, adminId) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        let findAdmin = await this.adminRepository.findOne({
            where: { adminid: adminId },
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
    async update(header, updateAdminDto) {
        const verifyAdmin = await this.authservice.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        const uuid = await this.authservice.decodeToken(header);
        const updateAdmin = await this.adminRepository.findOne({
            where: { uuid: uuid },
        });
        if (!updateAdmin) {
            throw new common_1.NotFoundException();
        }
        if (updateAdminDto.email !== updateAdmin.email) {
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
        console.log(uuid);
        return await this.adminRepository.save(updateAdmin);
    }
    async remove(header, adminId) {
        const verifyAdminId = await this.authservice.verifyAdminToken(header);
        if (!verifyAdminId) {
            throw new common_1.UnauthorizedException();
        }
        const adminToFind = await this.adminRepository.findOne({
            where: { adminid: adminId },
        });
        const adminToDelete = await this.adminRepository.delete({
            adminid: adminId,
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(agents_entity_1.Agents)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], AdminService);
//# sourceMappingURL=admin.service.js.map