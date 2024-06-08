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
const swagger_1 = require("@nestjs/swagger");
const mail_service_1 = require("./mail.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const admin_entity_1 = require("../admin/entities/admin.entity");
let MailController = class MailController {
    constructor(userRepository, adminRepository, mailsevice, jwtservice) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.mailsevice = mailsevice;
        this.jwtservice = jwtservice;
    }
    async sendMail(passengerId, header) {
        try {
            const user = await this.userRepository.findOneOrFail({
                where: { passengerId: passengerId },
            });
            const token = header['authorization'].replace('Bearer ', '');
            const decodedToken = await this.jwtservice.verifyAsync(token);
            const adminId = decodedToken.sub;
            const emailData = await this.adminRepository.findOne({
                where: { uuid: adminId },
            });
            const dto = {
                from: {
                    name: (emailData).firstName + (emailData).lastName,
                    address: (emailData).email,
                },
                recipeants: [
                    {
                        name: `${user.fullName} `,
                        address: user.email,
                    },
                ],
                subject: 'Information',
                html: `<h1>Hi ${user.fullName} !<h1><br>This email is forward to you confirming that you have booked a ticket with the booking id of `,
            };
            await this.mailsevice.sendMail(dto, header);
            return { success: true, message: 'Email sent successfully' };
        }
        catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Error sending email, Login again and try again',
            };
        }
    }
};
exports.MailController = MailController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('/send-email/:passengerId'),
    __param(0, (0, common_1.Param)('passengerId')),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendMail", null);
exports.MailController = MailController = __decorate([
    (0, swagger_1.ApiTags)('Email'),
    (0, common_1.Controller)('mail'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService,
        jwt_1.JwtService])
], MailController);
//# sourceMappingURL=mail.controller.js.map