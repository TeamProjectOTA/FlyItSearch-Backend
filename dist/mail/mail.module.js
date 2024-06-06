"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("./mail.service");
const mail_controller_1 = require("./mail.controller");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const auth_module_1 = require("../auth/auth.module");
const admin_module_1 = require("../admin/admin.module");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, admin_entity_1.Admin]),
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
        ],
        providers: [mail_service_1.MailService],
        controllers: [mail_controller_1.MailController],
    })
], MailModule);
//# sourceMappingURL=mail.module.js.map