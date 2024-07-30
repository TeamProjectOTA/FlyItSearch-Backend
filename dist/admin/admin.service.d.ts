import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { Agents } from 'src/agents/entities/agents.entity';
export declare class AdminService {
    private readonly adminRepository;
    private readonly userRepository;
    private readonly agentRepository;
    private readonly authservice;
    constructor(adminRepository: Repository<Admin>, userRepository: Repository<User>, agentRepository: Repository<Agents>, authservice: AuthService);
    create(createAdminDto: CreateAdminDto, header: any): Promise<Admin>;
    findAll(header: any): Promise<Admin[]>;
    findOne(header: any, adminId: string): Promise<Admin>;
    findOneUser(passengerId: string, header: any): Promise<User>;
    update(header: any, updateAdminDto: UpdateAdminDto): Promise<Admin>;
    remove(header: any, adminId: string): Promise<any>;
    removeUser(passengerId: string, header: any): Promise<{
        userToFind: User;
        userToDelete: import("typeorm").DeleteResult;
    }>;
}
