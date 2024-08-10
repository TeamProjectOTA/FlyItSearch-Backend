import { AuthService } from './auth.service';
import { Authdto, Userauthdto } from './createauthdto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class AuthController {
    private readonly authservice;
    private readonly userRepository;
    constructor(authservice: AuthService, userRepository: Repository<User>);
    signIn(signIndto: Authdto): Promise<any>;
    signInUser(signIndto: Userauthdto): Promise<any>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
}
