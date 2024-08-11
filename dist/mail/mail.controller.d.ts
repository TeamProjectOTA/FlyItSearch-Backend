import { MailService } from './mail.service';
export declare class MailController {
    private readonly mailerService;
    constructor(mailerService: MailService);
    sendMail(mailData: any, header: Headers): Promise<any>;
}
