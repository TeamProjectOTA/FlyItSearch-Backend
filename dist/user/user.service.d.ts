import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Transection } from 'src/transection/transection.model';
import { IpAddress } from 'src/ip/ip.model';
import { BookingSave } from 'src/book/booking.model';
import { TravelBuddy } from 'src/travel-buddy/travel-buddy.model';
export declare class UserService {
    private readonly userRepository;
    private readonly transectionRepository;
    private readonly authservice;
    private readonly ipAddressRepository;
    private readonly bookingSaveRepository;
    private readonly travelBuddyRepository;
    constructor(userRepository: Repository<User>, transectionRepository: Repository<Transection>, authservice: AuthService, ipAddressRepository: Repository<IpAddress>, bookingSaveRepository: Repository<BookingSave>, travelBuddyRepository: Repository<TravelBuddy>);
    create(createUserDto: CreateUserDto): Promise<any>;
    update(header: any, updateUserDto: UpdateUserDto): Promise<{
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
    allUser(header: any, page?: number, limit?: number): Promise<any>;
    findUserWithBookings(header: any, bookingStatus: string, page?: number, limit?: number): Promise<any>;
    findAllUserWithBookings(page: number, limit: number): Promise<any>;
    findOneUser(header: any): Promise<any>;
    findUserTravelBuddy(header: any, page?: number, limit?: number): Promise<any>;
    findUserTransactions(header: any, page?: number, limit?: number): Promise<any>;
    allTransection(page?: number, limit?: number): Promise<{
        transection: Transection[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateUserActivation(email: string, action: string): Promise<User>;
}
