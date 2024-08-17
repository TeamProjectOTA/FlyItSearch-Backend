import { Repository } from 'typeorm';
import { CreateSaveBookingDto, LagInfo, SaveBooking } from './booking.model';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
export declare class BookingService {
    private saveBookingRepository;
    private userRepository;
    private readonly authservice;
    private lagInfoRepository;
    constructor(saveBookingRepository: Repository<SaveBooking>, userRepository: Repository<User>, authservice: AuthService, lagInfoRepository: Repository<LagInfo>);
    saveBooking(createSaveBookingDto: CreateSaveBookingDto, header: any): Promise<SaveBooking>;
}
