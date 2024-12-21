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
exports.IpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ip_model_1 = require("./ip.model");
let IpService = class IpService {
    constructor(ipRepository) {
        this.ipRepository = ipRepository;
    }
    async findOne(ip) {
        return this.ipRepository.findOne({ where: { ip } });
    }
    async findByEmail(email) {
        return this.ipRepository.findOne({ where: { email } });
    }
    async create(ip, role, points, lastRequestTime, email) {
        const ipAddress = this.ipRepository.create({
            ip,
            role,
            points,
            lastRequestTime,
            email,
        });
        return this.ipRepository.save(ipAddress);
    }
    async createOrUpdate(ip, role, points, lastRequestTime, email) {
        let ipAddress = await this.findOne(ip);
        if (ipAddress) {
            ipAddress.role = role;
            ipAddress.points = points;
            ipAddress.lastRequestTime = lastRequestTime;
            ipAddress.email = email;
            return this.ipRepository.save(ipAddress);
        }
        else {
            return this.create(ip, role, points, lastRequestTime, email);
        }
    }
    async update(email, points) {
        const user = await this.ipRepository.findOne({ where: { email: email } });
        user.points = Number(points);
        return await this.ipRepository.save(user);
    }
    async findUser(email) {
        return await this.ipRepository.findOne({ where: { email: email } });
    }
    async cleanupOldIps(expirationTime) {
        await this.ipRepository.delete({
            lastRequestTime: (0, typeorm_2.LessThan)(expirationTime),
        });
    }
};
exports.IpService = IpService;
exports.IpService = IpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ip_model_1.IpAddress)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IpService);
//# sourceMappingURL=ip.service.js.map