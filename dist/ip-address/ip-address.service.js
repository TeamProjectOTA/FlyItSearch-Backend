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
exports.IpAddressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ip_address_model_1 = require("./ip-address.model");
let IpAddressService = class IpAddressService {
    constructor(ipAddressRepository) {
        this.ipAddressRepository = ipAddressRepository;
    }
    async getCount(ip) {
        const record = await this.ipAddressRepository.findOne({ where: { ip } });
        return record ? record.count : 0;
    }
    async getTimestamp(ip) {
        const record = await this.ipAddressRepository.findOne({ where: { ip } });
        return record ? record.updatedAt : new Date(0);
    }
    async resetCount(ip) {
        const record = await this.ipAddressRepository.findOne({ where: { ip } });
        if (record) {
            record.count = 0;
            record.updatedAt = new Date();
            await this.ipAddressRepository.save(record);
        }
    }
    async incrementCount(ip) {
        let record = await this.ipAddressRepository.findOne({ where: { ip } });
        if (!record) {
            record = new ip_address_model_1.IpAddress();
            record.ip = ip;
            record.count = 0;
        }
        record.count += 1;
        record.updatedAt = new Date();
        await this.ipAddressRepository.save(record);
    }
};
exports.IpAddressService = IpAddressService;
exports.IpAddressService = IpAddressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ip_address_model_1.IpAddress)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IpAddressService);
//# sourceMappingURL=ip-address.service.js.map