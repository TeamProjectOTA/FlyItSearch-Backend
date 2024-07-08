import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    update(header: Headers, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    findAllUser(header: Headers): Promise<import("./entities/user.entity").User[]>;
}
