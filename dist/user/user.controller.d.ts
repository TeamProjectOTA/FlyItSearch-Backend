import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<User>;
    update(header: Headers, updateUserDto: UpdateUserDto): Promise<User>;
    findAllUser(header: Headers): Promise<User[]>;
    findUserWithBookings(header: Headers, bookingStatus: string): Promise<Partial<User>>;
    findAllUserWithBookings(header: Headers): Promise<any>;
}
