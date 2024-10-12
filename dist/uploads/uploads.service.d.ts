import { ProfilePicture, VisaPassport } from './uploads.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { BookingSave } from 'src/book/booking.model';
export declare class UploadsService {
    private profilePictureRepository;
    private readonly authservice;
    private readonly userRepository;
    private readonly bookingSaveRepository;
    private readonly visaPassportRepository;
    private storage;
    private bucket;
    constructor(profilePictureRepository: Repository<ProfilePicture>, authservice: AuthService, userRepository: Repository<User>, bookingSaveRepository: Repository<BookingSave>, visaPassportRepository: Repository<VisaPassport>);
    create(header: any, file: Express.Multer.File): Promise<any>;
    uploadVisaAndPassportImages(bookingId: string, passportFile: Express.Multer.File, visaFile: Express.Multer.File): Promise<VisaPassport>;
    private uploadImage;
}
