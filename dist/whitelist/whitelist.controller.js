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
exports.WhitelistController = void 0;
const common_1 = require("@nestjs/common");
const whitelist_1 = require("./whitelist");
const whitelist_model_1 = require("./whitelist.model");
const swagger_1 = require("@nestjs/swagger");
let WhitelistController = class WhitelistController {
    constructor(whitelistService) {
        this.whitelistService = whitelistService;
    }
    async findAll() {
        return await this.whitelistService.findAll();
    }
    async saveData(ipWhitelistDTO) {
        return await this.whitelistService.save(ipWhitelistDTO);
    }
};
exports.WhitelistController = WhitelistController;
__decorate([
    (0, common_1.Get)('/findAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WhitelistController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('/save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [whitelist_model_1.IPWhitelistDTO]),
    __metadata("design:returntype", Promise)
], WhitelistController.prototype, "saveData", null);
exports.WhitelistController = WhitelistController = __decorate([
    (0, swagger_1.ApiTags)('Whitelistapi'),
    (0, common_1.Controller)('whitelist'),
    __metadata("design:paramtypes", [whitelist_1.WhitelistService])
], WhitelistController);
//# sourceMappingURL=whitelist.controller.js.map