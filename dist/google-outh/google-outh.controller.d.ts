import { GoogleOuthService } from './google-outh.service';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
export declare class GoogleOuthController {
    private readonly appService;
    private authService;
    constructor(appService: GoogleOuthService, authService: AuthService);
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    validateUser(user: {
        email: string;
        fullName: string;
        googleId: string;
    }): Promise<any>;
}
