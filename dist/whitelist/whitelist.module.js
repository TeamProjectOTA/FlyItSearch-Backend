"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhitelistModule = void 0;
const common_1 = require("@nestjs/common");
const whitelist_1 = require("./whitelist");
const typeorm_1 = require("@nestjs/typeorm");
const whitelist_controller_1 = require("./whitelist.controller");
const whitelist_model_1 = require("./whitelist.model");
let WhitelistModule = class WhitelistModule {
};
exports.WhitelistModule = WhitelistModule;
exports.WhitelistModule = WhitelistModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([whitelist_model_1.IPWhitelist])],
        providers: [whitelist_1.WhitelistService],
        exports: [whitelist_1.WhitelistService],
        controllers: [whitelist_controller_1.WhitelistController]
    })
], WhitelistModule);
//# sourceMappingURL=whitelist.module.js.map