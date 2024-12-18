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
exports.WhitelistService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const whitelist_model_1 = require("./whitelist.model");
const typeorm_2 = require("typeorm");
let WhitelistService = class WhitelistService {
    constructor(ipWhitelistRepository) {
        this.ipWhitelistRepository = ipWhitelistRepository;
    }
    async findAll() {
        const data = await this.ipWhitelistRepository.find({
            select: ['ip_address']
        });
        const ipAddress = data.map(item => item.ip_address);
        return ipAddress;
    }
    async save(ipWhitelistDTO) {
        const save = this.ipWhitelistRepository.create(ipWhitelistDTO);
        return await this.ipWhitelistRepository.save(save);
    }
};
exports.WhitelistService = WhitelistService;
exports.WhitelistService = WhitelistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(whitelist_model_1.IPWhitelist)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WhitelistService);
//# sourceMappingURL=whitelist.js.map