import { JwtService } from '@nestjs/jwt';
import { Admin } from 'src/admin/entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfilePicture } from 'src/uploads/uploads.model';
export declare class AuthService {
    private readonly adminRepository;
    private readonly userRepository;
    private readonly jwtservice;
    private readonly profilePictureRepository;
    private readonly time;
    constructor(adminRepository: Repository<Admin>, userRepository: Repository<User>, jwtservice: JwtService, profilePictureRepository: Repository<ProfilePicture>);
    signInAdmin(email: string, pass: string): Promise<any>;
    verifyAdminToken(header: any): Promise<Admin>;
    signInUser(email: string, pass?: string, isGoogleAuth?: boolean): Promise<any>;
    verifyUserToken(header: any): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getAdminByUUID(uuid: string): Promise<Admin>;
    decodeToken(header: any): Promise<string>;
    sendVerificationEmail(email: string, token: string): Promise<void>;
    findByVerificationToken(token: string): Promise<any>;
    resetPassword(resetToken: string, newPassword: string): Promise<any>;
    sendPasswordResetEmail(email: string): Promise<any>;
    sendResetPasswordEmail(email: string, token: string): Promise<void>;
    signInUserForGoogle(user: User): Promise<any>;
    validateUser(user: any): Promise<any>;
    emailVerified(email: string): Promise<void>;
    verifyGoogleToken(token: string): Promise<any>;
}
