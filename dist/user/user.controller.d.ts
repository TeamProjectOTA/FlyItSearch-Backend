import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<any>;
    update(header: Headers, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        fullName: string;
        email: string;
        phone: string;
        dob: string;
        nationility: string;
        gender: string;
        passport: string;
        passportexp: string;
    }>;
    findAllUser(header: Headers): Promise<User[]>;
    findUserWithBookings(header: Headers, bookingStatus: string): Promise<Partial<User>>;
    findAllUserWithBookings(): Promise<any>;
    findOneUser(header: Headers): Promise<any>;
    getUserTravelBuddies(header: Headers): Promise<any>;
    findOneUserTransection(header: Headers): Promise<{
        transection: import("../transection/transection.model").Transection[];
    }>;
    findAllUserTransection(): Promise<import("../transection/transection.model").Transection[]>;
    updateUserActivation(email: string, action: string): Promise<User>;
}
