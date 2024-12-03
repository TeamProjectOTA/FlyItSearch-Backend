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
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("./mail.service");
const swagger_1 = require("@nestjs/swagger");
let MailController = class MailController {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendMail(mailData) {
        return this.mailerService.sendMail(mailData);
    }
    async sendCancellationEmail(bookingId, status, email) {
        await this.mailerService.cancelMail(bookingId, status, email);
        return {
            success: true,
            message: `Cancellation email sent successfully to ${email}.`,
        };
    }
};
exports.MailController = MailController;
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendMail", null);
__decorate([
    (0, common_1.Get)('cancel'),
    __param(0, (0, common_1.Query)('bookingId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendCancellationEmail", null);
exports.MailController = MailController = __decorate([
    (0, swagger_1.ApiTags)('Mail'),
    (0, common_1.Controller)('mail'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
//# sourceMappingURL=mail.controller.js.map