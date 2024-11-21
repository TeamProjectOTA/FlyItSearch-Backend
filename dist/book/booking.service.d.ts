import { Repository } from 'typeorm';
import { BookingSave, CreateSaveBookingDto } from './booking.model';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { BookingIdSave } from 'src/flight/flight.model';
export declare class BookingService {
    private readonly userRepository;
    private readonly authservice;
    private readonly bookingSaveRepository;
    private readonly bookingIdSave;
    constructor(userRepository: Repository<User>, authservice: AuthService, bookingSaveRepository: Repository<BookingSave>, bookingIdSave: Repository<BookingIdSave>);
    saveBooking(createSaveBookingDto: CreateSaveBookingDto, header: any): Promise<any>;
    cancelDataSave(fsid: string, status: string, header: any): Promise<any>;
    findAllBooking(bookingStatus?: string): Promise<BookingSave[]>;
    findUserWithBookings(header: any, bookingStatus: string): Promise<any>;
}
