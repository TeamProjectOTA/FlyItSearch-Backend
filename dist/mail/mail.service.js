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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const auth_service_1 = require("../auth/auth.service");
let MailService = class MailService {
    constructor(config, authService) {
        this.config = config;
        this.authService = authService;
    }
    MailTransport() {
        const transporter = nodemailer.createTransport({
            host: this.config.get('EMAIL_HOST'),
            port: this.config.get('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.config.get('EMAIL_USERNAME'),
                pass: this.config.get('EMAIL_PASSWORD'),
            },
        });
        return transporter;
    }
    async sendMail(maildto, header) {
        const verifyAdmin = await this.authService.verifyAdminToken(header);
        if (!verifyAdmin) {
            throw new common_1.UnauthorizedException();
        }
        const { from, recipeants, subject, html } = maildto;
        const transport = this.MailTransport();
        const options = {
            from: from ?? {
                name: this.config.get('EMAIL_CC'),
                address: this.config.get('APP_NAME'),
            },
            to: recipeants,
            subject,
            html,
        };
        try {
            const result = await transport.sendMail(options);
            return result;
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], MailService);
//# sourceMappingURL=mail.service.js.map