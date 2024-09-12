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
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const auth_service_1 = require("../auth/auth.service");
let MailService = class MailService {
    constructor(authService) {
        this.authService = authService;
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        handlebars.registerHelper('formatTime', function (datetime) {
            return new Date(datetime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        });
        handlebars.registerHelper('formatDate', function (datetime) {
            return new Date(datetime).toLocaleDateString();
        });
        handlebars.registerHelper('formatDuration', function (duration) {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            return `${hours}h ${minutes}m`;
        });
    }
    async compileTemplate(templateName, data) {
        const filePath = path.join(process.cwd(), 'src', 'mail', `${templateName}.hbs`);
        const template = fs.readFileSync(filePath, 'utf-8');
        const compiledTemplate = handlebars.compile(template);
        return compiledTemplate(data);
    }
    async sendMail(data) {
        const flightUrl = 'http://localhost:8080/booking/flh/airRetrive';
        const bodyData = {
            BookingID: data.BookingId,
        };
        const html = await this.compileTemplate('booking', {
            BookingStatus: data.BookingStatus === 'Booked'
                ? 'Confirmed'
                : data.BookingStatus === 'Cancelled'
                    ? 'Cancellation'
                    : '',
            BookingId: data.BookingId,
            CarrierName: data.CarrierName,
            NetFare: data.NetFare,
            AllLegsInfo: data.AllLegsInfo,
            PassengerList: data.PassengerList,
            flightUrl: flightUrl,
            bodyData: bodyData,
        });
        const email = data?.PassengerList[0]?.Email;
        const mailOptions = {
            from: process.env.EMAIL_CC,
            to: email,
            subject: `Flight ${data.BookingStatus} confirmation`,
            html,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            return { message: 'The email was delivered', info };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], MailService);
//# sourceMappingURL=mail.service.js.map