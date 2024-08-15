import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
export declare class UserService {
    private readonly userRepository;
    private readonly authservice;
    constructor(userRepository: Repository<User>, authservice: AuthService);
    create(createUserDto: CreateUserDto): Promise<any>;
    update(header: any, updateUserDto: UpdateUserDto): Promise<User>;
    allUser(header: any): Promise<User[]>;
    findUserWithBookings(header: any, bookingStatus: string): Promise<any>;
    findAllUserWithBookings(header: any): Promise<any>;
    findOneUser(header: any): Promise<any>;
}
