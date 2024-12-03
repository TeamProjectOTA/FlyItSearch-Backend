import { MailService } from './mail.service';
export declare class MailController {
    private readonly mailerService;
    constructor(mailerService: MailService);
    sendMail(mailData: any): Promise<{
        message: string;
        info: any;
    }>;
    sendCancellationEmail(bookingId: string, status: string, email: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
