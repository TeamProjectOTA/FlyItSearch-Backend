import { ProfilePicture } from './uploads.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import * as AWS from 'aws-sdk';
import { VisitPlaceImage } from 'src/tour-package/entities/visitPlaceImage.model';
import { TourPackage } from 'src/tour-package/entities/tourPackage.model';
export declare class UploadsService {
    private readonly s3;
    private profilePictureRepository;
    private readonly authservice;
    private readonly userRepository;
    private readonly visitPlaceImageRepository;
    private readonly mainImageRepository;
    private readonly tourPackageRepository;
    constructor(s3: AWS.S3, profilePictureRepository: Repository<ProfilePicture>, authservice: AuthService, userRepository: Repository<User>, visitPlaceImageRepository: Repository<VisitPlaceImage>, mainImageRepository: Repository<VisitPlaceImage>, tourPackageRepository: Repository<TourPackage>);
    uploadImage(file: any, res?: any): Promise<void>;
    create(header: any, file: Express.Multer.File): Promise<any>;
    saveVisitPlaceImages(tourPackageId: number, files: Express.Multer.File[]): Promise<VisitPlaceImage[]>;
    private uploadSingleToDO;
}
