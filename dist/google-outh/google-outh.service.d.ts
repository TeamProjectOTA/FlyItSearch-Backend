export declare class GoogleOuthService {
    googleLogin(req: any): "No user from google" | {
        message: string;
        user: any;
    };
    facebookLogin(req: any): "No user from facebook" | {
        message: string;
        user: any;
    };
}
