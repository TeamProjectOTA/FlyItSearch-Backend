import { AuthService } from './auth.service';
import { Authdto, Userauthdto } from './createauthdto';
export declare class AuthController {
    private readonly authservice;
    constructor(authservice: AuthService);
    signIn(signIndto: Authdto): Promise<{
        access_token: string;
    }>;
    signInUser(signIndto: Userauthdto): Promise<{
        access_token: string;
    }>;
}
