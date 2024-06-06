import { MailService } from './mail.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from 'src/admin/entities/admin.entity';
export declare class MailController {
    private readonly userRepository;
    private readonly adminRepository;
    private readonly mailsevice;
    private readonly jwtservice;
    constructor(userRepository: Repository<User>, adminRepository: Repository<Admin>, mailsevice: MailService, jwtservice: JwtService);
    sendMail(passengerId: string, header: Headers): Promise<{
        success: boolean;
        message: string;
    }>;
}
