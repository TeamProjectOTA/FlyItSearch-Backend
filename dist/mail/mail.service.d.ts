import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { sendEmaildto } from './mail.interface';
import { AuthService } from 'src/auth/auth.service';
export declare class MailService {
    private readonly config;
    private readonly authService;
    constructor(config: ConfigService, authService: AuthService);
    MailTransport(): nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendMail(maildto: sendEmaildto, header: any): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
