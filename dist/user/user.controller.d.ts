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
    findAllUser(header: Headers, page: string, limit: string): Promise<any>;
    findUserWithBookings(header: Headers, bookingStatus: string, page: string, limit: string): Promise<Partial<User>>;
    findAllUserWithBookings(page?: number, limit?: number): Promise<any>;
    findOneUser(header: Headers): Promise<any>;
    getUserTravelBuddies(header: Headers, page: string, limit: string): Promise<any>;
    findOneUserTransection(header: Headers, page: string, limit: string): Promise<any>;
    findAllUserTransection(page: string, limit: string): Promise<{
        transection: import("../transection/transection.model").Transection[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateUserActivation(email: string, action: string): Promise<User>;
}
