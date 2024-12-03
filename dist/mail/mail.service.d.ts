import { AuthService } from 'src/auth/auth.service';
export declare class MailService {
    private readonly authService;
    private transporter;
    constructor(authService: AuthService);
    private compileTemplate;
    sendMail(data: any, header?: any): Promise<{
        message: string;
        info: any;
    }>;
    cancelMail(bookingId: string, status: string, email: string): Promise<void>;
}
