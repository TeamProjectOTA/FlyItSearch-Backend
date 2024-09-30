"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ip_service_1 = require("./ip.service");
const ip_model_1 = require("./ip.model");
const schedule_1 = require("@nestjs/schedule");
const ip_cleanup_service_1 = require("./ip-cleanup.service");
const ip_controller_1 = require("./ip.controller");
const auth_module_1 = require("../auth/auth.module");
let IpModule = class IpModule {
};
exports.IpModule = IpModule;
exports.IpModule = IpModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ip_model_1.IpAddress]), schedule_1.ScheduleModule.forRoot(), auth_module_1.AuthModule],
        providers: [ip_service_1.IpService, ip_cleanup_service_1.IpCleanupService],
        exports: [ip_service_1.IpService, ip_cleanup_service_1.IpCleanupService],
        controllers: [ip_controller_1.IpController],
    })
], IpModule);
//# sourceMappingURL=ip.module.js.map