import { GoogleOuthService } from './google-outh.service';
export declare class GoogleOuthController {
    private readonly appService;
    constructor(appService: GoogleOuthService);
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any): "No user from google" | {
        message: string;
        user: any;
    };
    facebookAuth(req: any): Promise<void>;
    facebookAuthRedirect(req: any): "No user from facebook" | {
        message: string;
        user: any;
    };
}
