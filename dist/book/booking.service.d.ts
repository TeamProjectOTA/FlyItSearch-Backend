import { Repository } from 'typeorm';
import { CreateSaveBookingDto, SaveBooking } from './booking.model';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
export declare class BookingService {
    private saveBookingRepository;
    private userRepository;
    private readonly authservice;
    constructor(saveBookingRepository: Repository<SaveBooking>, userRepository: Repository<User>, authservice: AuthService);
    saveBooking(createSaveBookingDto: CreateSaveBookingDto, header: any): Promise<SaveBooking>;
}
