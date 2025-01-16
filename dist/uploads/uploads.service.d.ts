import { ProfilePicture } from './uploads.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import * as AWS from 'aws-sdk';
export declare class UploadsService {
    private readonly s3;
    private profilePictureRepository;
    private readonly authservice;
    private readonly userRepository;
    constructor(s3: AWS.S3, profilePictureRepository: Repository<ProfilePicture>, authservice: AuthService, userRepository: Repository<User>);
    uploadImage(file: any, res?: any): Promise<void>;
    create(header: any, file: Express.Multer.File): Promise<any>;
}
