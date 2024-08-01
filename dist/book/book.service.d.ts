import { Repository } from 'typeorm';
import { CreateSaveBookingDto, File, SaveBooking } from './book.model';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
export declare class BookService {
    private readonly fileRepository;
    private saveBookingRepository;
    private userRepository;
    private readonly authservice;
    constructor(fileRepository: Repository<File>, saveBookingRepository: Repository<SaveBooking>, userRepository: Repository<User>, authservice: AuthService);
    saveFile(file: Express.Multer.File): Promise<File>;
    saveBooking(createSaveBookingDto: CreateSaveBookingDto, header: any): Promise<SaveBooking>;
}
