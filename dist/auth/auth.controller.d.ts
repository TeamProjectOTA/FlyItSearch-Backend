import { AuthService } from './auth.service';
import { Authdto, Userauthdto } from './createauthdto';
export declare class AuthController {
    private readonly authservice;
    constructor(authservice: AuthService);
    signIn(signIndto: Authdto): Promise<any>;
    signInUser(signIndto: Userauthdto): Promise<any>;
}
