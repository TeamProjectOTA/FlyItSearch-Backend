import { JwtService } from '@nestjs/jwt';
import { Admin } from 'src/admin/entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private readonly adminRepository;
    private readonly userRepository;
    private readonly jwtservice;
    constructor(adminRepository: Repository<Admin>, userRepository: Repository<User>, jwtservice: JwtService);
    signInAdmin(adminId: string, pass: string): Promise<{
        access_token: string;
        admin: Partial<Admin>;
    }>;
    verifyAdminToken(header: any): Promise<Admin>;
    signInUser(email: string, pass: string): Promise<{
        access_token: string;
        user: Partial<User>;
    }>;
    verifyUserToken(header: any): Promise<User>;
}
