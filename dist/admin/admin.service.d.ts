import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { Agents } from 'src/agents/entities/agents.entity';
import { BookingSave } from 'src/book/booking.model';
export declare class AdminService {
    private readonly adminRepository;
    private readonly userRepository;
    private readonly agentRepository;
    private readonly bookingSaveRepository;
    private readonly authservice;
    constructor(adminRepository: Repository<Admin>, userRepository: Repository<User>, agentRepository: Repository<Agents>, bookingSaveRepository: Repository<BookingSave>, authservice: AuthService);
    create(createAdminDto: CreateAdminDto, header: any): Promise<Admin>;
    findAll(header: any): Promise<Admin[]>;
    findOne(header: any, uuid: string): Promise<Admin>;
    findOneUser(passengerId: string, header: any): Promise<User>;
    update(header: any, updateAdminDto: UpdateAdminDto, uuid: any): Promise<Admin>;
    remove(header: any, uuid: string): Promise<any>;
    removeUser(passengerId: string, header: any): Promise<{
        userToFind: User;
        userToDelete: import("typeorm").DeleteResult;
    }>;
    allbooking(): Promise<BookingSave[]>;
}
