import { GoogleOuthService } from './google-outh.service';
import { AuthService } from 'src/auth/auth.service';
export declare class GoogleOuthController {
    private readonly appService;
    private authService;
    constructor(appService: GoogleOuthService, authService: AuthService);
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any): Promise<any>;
}
