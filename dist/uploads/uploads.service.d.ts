import { ProfilePicture } from './uploads.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
export declare class UploadsService {
    private profilePictureRepository;
    private readonly authservice;
    private readonly userRepository;
    constructor(profilePictureRepository: Repository<ProfilePicture>, authservice: AuthService, userRepository: Repository<User>);
    create(header: any, file: Express.Multer.File): Promise<ProfilePicture>;
    delete(header: any): Promise<any>;
}
