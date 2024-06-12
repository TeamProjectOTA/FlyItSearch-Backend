import { JwtService } from '@nestjs/jwt';
import { Admin } from 'src/admin/entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private readonly adminRepository;
    private readonly userRepository;
    private readonly jwtservice;
    constructor(adminRepository: Repository<Admin>, userRepository: Repository<User>, jwtservice: JwtService);
    signInAdmin(uuid: string, pass: string): Promise<{
        access_token: string;
    }>;
    verifyAdminToken(header: any): Promise<Admin>;
    signInUser(email: string, pass: string): Promise<{
        access_token: string;
    }>;
    verifyUserToken(header: any): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getAdminByUUID(uuid: string): Promise<Admin>;
    decodeToken(header: any): Promise<any>;
}
