import { AuthService } from './auth.service';
import { Authdto, Userauthdto } from './createauthdto';
export declare class AuthController {
    private readonly authservice;
    constructor(authservice: AuthService);
    signIn(signIndto: Authdto): Promise<{
        access_token: string;
        admin: Partial<import("../admin/entities/admin.entity").Admin>;
    }>;
    signInUser(signIndto: Userauthdto): Promise<{
        access_token: string;
        user: Partial<import("../user/entities/user.entity").User>;
    }>;
}
