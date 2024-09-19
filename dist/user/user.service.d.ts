import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Transection } from 'src/transection/transection.model';
export declare class UserService {
    private readonly userRepository;
    private readonly transectionRepository;
    private readonly authservice;
    constructor(userRepository: Repository<User>, transectionRepository: Repository<Transection>, authservice: AuthService);
    create(createUserDto: CreateUserDto): Promise<any>;
    update(header: any, updateUserDto: UpdateUserDto): Promise<User>;
    allUser(header: any): Promise<User[]>;
    findUserWithBookings(header: any, bookingStatus: string): Promise<any>;
    findAllUserWithBookings(): Promise<any>;
    findOneUser(header: any): Promise<any>;
    findUserTravelBuddy(header: any): Promise<any>;
    findUserTransection(header: any): Promise<{
        transection: Transection[];
    }>;
    allTransection(): Promise<Transection[]>;
    updateUserActivation(email: string, action: string): Promise<User>;
}
