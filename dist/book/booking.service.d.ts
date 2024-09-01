import { Repository } from 'typeorm';
import { BookingSave, CreateSaveBookingDto } from './booking.model';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
export declare class BookingService {
    private userRepository;
    private readonly authservice;
    private readonly BookingSaveRepository;
    constructor(userRepository: Repository<User>, authservice: AuthService, BookingSaveRepository: Repository<BookingSave>);
    saveBooking(createSaveBookingDto: CreateSaveBookingDto, header: any): Promise<any>;
    cancelDataSave(fsid: string, status: string, header: any): Promise<any>;
}
