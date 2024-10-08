import { AuthService } from 'src/auth/auth.service';
export declare class MailService {
    private readonly authService;
    private transporter;
    constructor(authService: AuthService);
    private compileTemplate;
    sendMail(data: any): Promise<{
        message: string;
        info: any;
    }>;
    mailDataConvert(data: any): Promise<{
        message: string;
        info: any;
    }>;
}
