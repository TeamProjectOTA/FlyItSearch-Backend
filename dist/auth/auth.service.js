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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const admin_entity_1 = require("../admin/entities/admin.entity");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(adminRepository, userRepository, jwtservice) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.jwtservice = jwtservice;
    }
    async signInAdmin(uuid, pass) {
        const admin = await this.adminRepository.findOne({
            where: { uuid: uuid },
        });
        if (!admin || admin.password !== pass) {
            throw new common_1.UnauthorizedException('Invalid UUID or password');
        }
        const payload = { sub: admin.uuid };
        const token = await this.jwtservice.signAsync(payload);
        return { access_token: token };
    }
    async verifyAdminToken(header) {
        try {
            const authHeader = header['authorization'];
            if (!authHeader) {
                throw new common_1.UnauthorizedException('No token provided.');
            }
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new common_1.UnauthorizedException();
            }
            const decodedToken = await this.jwtservice.verifyAsync(token);
            const uuid = decodedToken.sub;
            const adminData = await this.adminRepository.findOne({
                where: { uuid: uuid },
            });
            if (!adminData) {
                throw new common_1.UnauthorizedException('Admin not found.');
            }
            return adminData;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('Token has expired');
            }
            else {
                throw new common_1.UnauthorizedException('Invalid token');
            }
        }
    }
    async signInUser(email, pass) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const passwordMatch = await bcrypt.compare(pass, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const payload = { sub: user.email, sub2: user.passengerId };
        const token = await this.jwtservice.signAsync(payload);
        return {
            access_token: token
        };
    }
    async verifyUserToken(header) {
        try {
            const authHeader = header['authorization'];
            if (!authHeader) {
                throw new common_1.UnauthorizedException('No token provided.');
            }
            const token = authHeader.replace('Bearer ', '');
            const decodedToken = await this.jwtservice.verifyAsync(token);
            const email = decodedToken.sub;
            const userData = await this.userRepository.findOne({
                where: { email: email },
            });
            if (!userData) {
                throw new common_1.UnauthorizedException('User not found.');
            }
            return userData;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('Token has expired');
            }
            else {
                throw new common_1.UnauthorizedException('Invalid token');
            }
        }
    }
    async getUserByEmail(email) {
        return this.userRepository.findOne({ where: { email: email } });
    }
    async getAdminByUUID(uuid) {
        return this.adminRepository.findOne({ where: { uuid: uuid } });
    }
    async decodeToken(header) {
        if (!header || !header.authorization) {
            throw new common_1.NotFoundException('Authorization header not found');
        }
        const token = header.authorization.replace('Bearer ', '');
        let decodedToken;
        try {
            decodedToken = await this.jwtservice.verifyAsync(token);
        }
        catch (error) {
            throw new common_1.NotFoundException('Invalid token');
        }
        if (!decodedToken || !decodedToken.sub2) {
            throw new common_1.NotFoundException('Invalid token payload');
        }
        return decodedToken.sub;
    }
    async verifyBothToken(header) {
        let isUserTokenValid = false;
        let isAdminTokenValid = false;
        try {
            await this.verifyUserToken(header);
            isUserTokenValid = true;
        }
        catch (error) {
            console.log(error);
        }
        try {
            await this.verifyAdminToken(header);
            isAdminTokenValid = true;
        }
        catch (error) {
        }
        if (!isUserTokenValid && !isAdminTokenValid) {
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map