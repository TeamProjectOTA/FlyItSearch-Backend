import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    create(createAdminDto: CreateAdminDto, header: Headers): Promise<import("./entities/admin.entity").Admin>;
    findOne(header: Headers, uuid: string): Promise<import("./entities/admin.entity").Admin>;
    update(header: Headers, updateAdminDto: UpdateAdminDto, uuid: string): Promise<import("./entities/admin.entity").Admin>;
    remove(header: Headers, uuid: string): Promise<any>;
    findAll(header: Headers): Promise<import("./entities/admin.entity").Admin[]>;
    findUser(header: Headers, passengerId: string): Promise<import("../user/entities/user.entity").User>;
    removeuser(header: Headers, passengerId: string): Promise<{
        userToFind: import("../user/entities/user.entity").User;
        userToDelete: import("typeorm").DeleteResult;
    }>;
    allBooking(): Promise<import("../book/booking.model").BookingSave[]>;
}
