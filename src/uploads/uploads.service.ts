import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePicture } from './uploads.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import path, { extname, join } from 'path';
import { AuthService } from 'src/auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import { DoSpacesServiceLib } from './upload.provider.service';
import * as dotenv from "dotenv"
import { VisitPlaceImage } from 'src/tour-package/entities/visitPlaceImage.model';
import { MainImage } from 'src/tour-package/entities/mainImage.model';
import { TourPackage } from 'src/tour-package/entities/tourPackage.model';
dotenv.config();

@Injectable()
export class UploadsService {
  constructor(
    @Inject(DoSpacesServiceLib)
    private readonly s3: AWS.S3,
    @InjectRepository(ProfilePicture)
    private profilePictureRepository: Repository<ProfilePicture>,
    private readonly authservice: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VisitPlaceImage)
    private readonly visitPlaceImageRepository:Repository<VisitPlaceImage>,
    @InjectRepository(MainImage)
    private readonly mainImageRepository:Repository<VisitPlaceImage>,
    @InjectRepository(TourPackage)
      private readonly tourPackageRepository: Repository<TourPackage>,
  ){}

  // async create(header: any, file: Express.Multer.File): Promise<any> {
  //   const decodeToken = await this.authservice.decodeToken(header);
  //   const user = await this.userRepository.findOne({
  //     where: { email: decodeToken },
  //   });

  //   if (!user) {
  //     throw new BadRequestException('User not found.');
  //   }

  //   const existingProfilePicture = await this.profilePictureRepository.findOne({
  //     where: { user },
  //   });

  //   if (existingProfilePicture) {
  //     let fileDeleted = false;

  //     try {
  //       const bucketFile = this.storage
  //         .bucket(this.bucket)
  //         .file(existingProfilePicture.filename);

  //       await bucketFile.delete();
  //       fileDeleted = true;
  //     } catch (error) {
  //       if (error.code === 404) {
  //         console.warn(
  //           'File not found in Google Cloud bucket. Proceeding with database deletion.',
  //         );
  //       } else {
  //         console.error(
  //           'Error deleting file from Google Cloud:',
  //           error.message,
  //         );
  //         throw new BadRequestException(
  //           'Failed to delete the profile picture file from Google Cloud.',
  //         );
  //       }
  //     }

  //     try {
  //       await this.profilePictureRepository.remove(existingProfilePicture);
  //     } catch (error) {
  //       throw new BadRequestException(
  //         'Failed to delete the profile picture from the database.',
  //       );
  //     }
  //   }

  //   const fileExtension = extname(file.originalname);
  //   const folderName = 'ProfilePicture';
  //   const filename = `${folderName}/${user.passengerId}-ProfilePicture${uuidv4()}${fileExtension}`;

  //   try {
  //     const bucketFile = this.storage.bucket(this.bucket).file(filename);

  //     await bucketFile.save(file.buffer, {
  //       contentType: file.mimetype,
  //       public: true,
  //     });

  //     const publicUrl = `https://storage.googleapis.com/${this.bucket}/${filename}`;

  //     const profilePicture = this.profilePictureRepository.create({
  //       user,
  //       filename,
  //       link: publicUrl,
  //       size: file.size,
  //     });
  //     const save = await this.profilePictureRepository.save(profilePicture);
  //     return {
  //       Message: 'Image Uploaded Successful',
  //       save: { link: save.link, size: save.size },
  //     };
  //   } catch (error) {
  //     console.error('Error uploading file to Google Cloud:', error.message);
  //     throw new BadRequestException(
  //       'Failed to upload and save profile picture.',
  //     );
  //   }
  // }

  // async uploadImage(file: Express.Multer.File): Promise<any> {
  //   const timestamp = Date.now();
  //   const randomNumber = Math.floor(Math.random() * 1000);
  //   const random = `${timestamp}${randomNumber}`;
  //   const folderName = 'PassportVisa';
  //   const fileExtension = extname(file.originalname);
  //   const fileName = `${folderName}/${random}-image${fileExtension}`;
  //   const blob = this.storage.bucket(this.bucket).file(fileName);

  //   const blobStream = blob.createWriteStream({
  //     metadata: { contentType: file.mimetype },
  //     public: true,
  //   });

  //   const link = await new Promise((resolve, reject) => {
  //     blobStream.on('error', (err) => reject(err));
  //     blobStream.on('finish', () => {
  //       const publicUrl = `https://storage.googleapis.com/${this.bucket}/${fileName}`;
  //       resolve(publicUrl);
  //     });
  //     blobStream.end(file.buffer);
  //   });
  //   return { link: link };
  // }

  async uploadImage(file: any, res?: any) {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const random = `${timestamp}${randomNumber}`;
    const folderName = 'PassportVisa';
    const fileExtension = extname(file.originalname);
    const fileName = `${folderName}/${random}-image${fileExtension}`;
  

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
    };

   

    this.s3.putObject(params, (err, data) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ status: 'error', message: 'Error uploading file' });
        } else {
            const url = process.env.CDN_SPACES + '/' + fileName;
            return res.status(201).json({link: url });
        }
    });
}

async create(header: any, file: Express.Multer.File): Promise<any> {
  const decodeToken = await this.authservice.decodeToken(header);
  const user = await this.userRepository.findOne({
    where: { email: decodeToken },
  });

  if (!user) {
    throw new BadRequestException('User not found.');
  }

  
  const existingProfilePicture = await this.profilePictureRepository.findOne({
    where: { user },
  });

  if (existingProfilePicture) {
    try {
     
      await this.s3
        .deleteObject({
          Bucket: process.env.BUCKET_NAME, 
          Key: existingProfilePicture.filename, 
        })
        .promise();
      console.log('File deleted from AWS S3:', existingProfilePicture.filename);
      await this.profilePictureRepository.remove(existingProfilePicture);
    } catch (error) {
      console.error('Error deleting file from AWS S3:', error.message);
      throw new BadRequestException('Failed to delete the profile picture.');
    }
  }
  const fileExtension = extname(file.originalname);
  const folderName = 'ProfilePicture';
  const filename = `${folderName}/${user.passengerId}-ProfilePicture-${uuidv4()}${fileExtension}`;

  try {
    
    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: process.env.BUCKET_NAME, 
      Key: filename, 
      Body: file.buffer, 
      ACL: 'public-read',
      ContentType: file.mimetype, 
    };

    await this.s3.upload(uploadParams).promise();

    const publicUrl = `${process.env.CDN_SPACES}/${filename}`;
    const profilePicture = this.profilePictureRepository.create({
      user,
      filename,
      link: publicUrl,
      size: file.size,
    });
    const save = await this.profilePictureRepository.save(profilePicture);

    return {
      Message: 'Image Uploaded Successfully',
      save: { link: save.link, size: save.size },
    };
  } catch (error) {
    throw new BadRequestException('Failed to upload and save profile picture.'+error);
  }
}

async saveVisitPlaceImages(tourPackageId: number, files: Express.Multer.File[]): Promise<VisitPlaceImage[]> {
  if (files.length < 1 || files.length > 6) {
    throw new HttpException('You must upload between 1 to 6 images.', HttpStatus.BAD_REQUEST);
  }

  const tourPackage = await this.tourPackageRepository.findOne({
    where: { id: tourPackageId },
    relations: ['visitPlaceImage'], // Fetch existing images for the TourPackage
  });

  if (!tourPackage) {
    throw new HttpException('TourPackage not found', HttpStatus.NOT_FOUND);
  }

  const existingImagesCount = tourPackage.visitPlaceImage.length;
  const savedImages: VisitPlaceImage[] = [];

  // Upload and save images one at a time
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Upload single image
    const uploadedImageUrl = await this.uploadSingleToDO(file);

    // Create a VisitPlaceImage entity
    const visitPlaceImage = this.visitPlaceImageRepository.create({
      imageUrl: uploadedImageUrl,
      index: existingImagesCount + i + 1, // Assign sequential index
      tourPackage,
    });

    // Save the entity to the database
    const savedImage = await this.visitPlaceImageRepository.save(visitPlaceImage);

    // Add saved image to the result array
    savedImages.push(savedImage);
  }

  return savedImages;
}

private async uploadSingleToDO(file: Express.Multer.File): Promise<string> {
  const fileName = `tourpackageVisitplaceimage/${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: process.env.SPACES_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };

  try {
    const data = await this.s3.upload(params).promise();
    return `${process.env.CDN_SPACES}/${fileName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new HttpException('Error uploading file to DigitalOcean Spaces', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}



}
