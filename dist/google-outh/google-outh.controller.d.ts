import { GoogleOuthService } from './google-outh.service';
import { AuthService } from 'src/auth/auth.service';
export declare class GoogleOuthController {
    private readonly appService;
    private authService;
    constructor(appService: GoogleOuthService, authService: AuthService);
    googleAuth(req: Request): Promise<void>;
    googleAuthRedirect(req: any): Promise<any>;
    facebookAuth(req: any): Promise<void>;
    facebookAuthRedirect(req: any): "No user from facebook" | {
        message: string;
        user: any;
    };
}
