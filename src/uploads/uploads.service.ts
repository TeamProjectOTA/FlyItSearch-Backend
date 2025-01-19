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
    relations: ['visitPlaceImage'], 
  });
  if (!tourPackage) {
    throw new HttpException('TourPackage not found', HttpStatus.NOT_FOUND);
  }

  const existingImagesCount = tourPackage.visitPlaceImage.length;
  const savedImages: VisitPlaceImage[] = [];
const packageId=tourPackage.packageId
if(existingImagesCount>6){
  throw new ConflictException('You Can not add more than 6 picture to a tourpackage VisitPlaceImage')
}
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const uploadedImageUrl = await this.uploadSingleToDO(packageId,file);
    const visitPlaceImage = this.visitPlaceImageRepository.create({
      imageUrl: uploadedImageUrl,
      index: existingImagesCount + i + 1, 
      tourPackage,
    });
    const savedImage = await this.visitPlaceImageRepository.save(visitPlaceImage);
    savedImages.push(savedImage);
  }

  return savedImages;
}

private async uploadSingleToDO(packageId:string,file: Express.Multer.File): Promise<string> {
  
  const fileExtension = extname(file.originalname); 
  const folderName = 'tourpackage/Visitplaceimage';
  const filename = `${folderName}/${packageId}-visitPlace-${uuidv4()}${fileExtension}`; 
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };

  try {
    const data = await this.s3.upload(params).promise();
    return `${process.env.CDN_SPACES}/${filename}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new HttpException('Error uploading file to DigitalOcean Spaces', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


async updateVisitPlaceByTourPackage(id: number, file: Express.Multer.File): Promise<any> {
  
  const visitPlaceImages = await this.visitPlaceImageRepository.findOne({
    where: { id:id },
    relations:['tourPackage']
  });
  const tourPackage=visitPlaceImages.tourPackage

  if (!visitPlaceImages) {
    throw new NotFoundException('No images found for the given tour package');
  }
  try {
    const image= visitPlaceImages
      const key = image.imageUrl.split(`${process.env.CDN_SPACES}/`)[1]; 
      await this.s3
        .deleteObject({
          Bucket: process.env.BUCKET_NAME,
          Key: key,
        })
        .promise();
      console.log('File deleted from AWS S3:', key);
    
  } catch (error) {
    throw new BadRequestException('Failed to delete existing images from AWS S3');
  }

 const packageId=tourPackage.packageId
  const fileExtension = extname(file.originalname); 
  const folderName = 'tourpackageVisitplaceimage';
  const filename = `${folderName}/${packageId}-visitPlace-${uuidv4()}${fileExtension}`; 

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
    const image=visitPlaceImages
      image.imageUrl = publicUrl; 
      await this.visitPlaceImageRepository.save(image);
    return {
      message: 'Image URLs updated successfully for the tour package',
      images: visitPlaceImages,
    };
  } catch (error) {
    throw new BadRequestException('Failed to upload and update image URLs');
  }
}




async saveMainImage(tourPackageId: number, files: Express.Multer.File[]): Promise<MainImage[]> {
  if (files.length < 1 || files.length > 6) {
    throw new HttpException('You must upload between 1 to 6 images.', HttpStatus.BAD_REQUEST);
  }

  const tourPackage = await this.tourPackageRepository.findOne({
    where: { id: tourPackageId },
    relations: ['mainImage'], 
  });
  if (!tourPackage) {
    throw new HttpException('TourPackage not found', HttpStatus.NOT_FOUND);
  }

  const existingImagesCount = tourPackage.mainImage.length;
  const savedImages: MainImage[] = [];
  const packageId=tourPackage.packageId
  if(existingImagesCount>=6){
  throw new ConflictException('You Can not add more than 6 picture to a tourpackage VisitPlaceImage')
}
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const uploadedImageUrl = await this.singlePictureUploadToMainImage(packageId,file);
    const mainImage = this.mainImageRepository.create({
      imageUrl: uploadedImageUrl,
      index: existingImagesCount + i + 1, 
      tourPackage,
    });
    const savedImage = await this.mainImageRepository.save(mainImage);
    savedImages.push(savedImage);
  }

  return savedImages;
}

private async singlePictureUploadToMainImage(packageId:string,file: Express.Multer.File): Promise<string> {
  
  const fileExtension = extname(file.originalname); 
  const folderName = 'tourpackage/MainImage';
  const filename = `${folderName}/${packageId}-mainImage-${uuidv4()}${fileExtension}`; 
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };

  try {
    const data = await this.s3.upload(params).promise();
    return `${process.env.CDN_SPACES}/${filename}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new HttpException('Error uploading file to DigitalOcean Spaces', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


async mainImageUpdateByTourPackage(id: number, file: Express.Multer.File): Promise<any> {
  
  const mainImage = await this.mainImageRepository.findOne({
    where: { id:id },
    relations:['tourPackage']
  });
  if (!mainImage) {
    throw new NotFoundException('No images found for the given tour package');
  }
  const tourPackage=mainImage.tourPackage


  try {
    const image= mainImage
      const key = image.imageUrl.split(`${process.env.CDN_SPACES}/`)[1]; 
      await this.s3
        .deleteObject({
          Bucket: process.env.BUCKET_NAME,
          Key: key,
        })
        .promise();
    
  } catch (error) {
    throw new BadRequestException('Failed to delete existing images from AWS S3');
  }

 const packageId=tourPackage.packageId
 const fileExtension = extname(file.originalname); 
 const folderName = 'tourpackage/MainImage';
 const filename = `${folderName}/${packageId}-mainImage-${uuidv4()}${fileExtension}`; 

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
    const image=mainImage
      image.imageUrl = publicUrl; 
      await this.mainImageRepository.save(image);
    return {
      message: 'Image URLs updated successfully for the tour package',
      images: mainImage,
    };
  } catch (error) {
    throw new BadRequestException('Failed to upload and update image URLs');
  }
}


async uploadImageUpdate(file: any, existingImageLink?: string): Promise<any> {
  
  if (existingImageLink) {
    const existingFileName = existingImageLink.split('/').pop();
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: existingFileName,
    };
    try {
      await this.s3.deleteObject(deleteParams).promise();
      console.log('Existing image deleted');
    } catch (err) {
      console.error('Error deleting existing image:', err);
      throw new Error('Error deleting existing image');
    }
  }
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

  try {
    await this.s3.putObject(params).promise();
    const url = process.env.CDN_SPACES + '/' + fileName;
    return { link: url };
  } catch (err) {
    console.error('Error uploading file:', err);
    throw new Error('Error uploading file');
  }
}



// async deleteImage(imageUrl: string): Promise<{ message: string }> {
  
//   const imageRecord = await this.visitPlaceImageRepository.findOneBy({ imageUrl });

//   if (!imageRecord) {
//     throw new NotFoundException('Image not found in the database');
//   }


//   const url = new URL(imageUrl);
//   const bucketName = url.hostname; 
//   const key = url.pathname.substring(1); 
//   console.log(key)
//   const params = {
//     Bucket: bucketName,
//     Key: key,
//   };

//   try {
//     await this.s3.deleteObject(params).promise();
//     console.log(`File deleted from S3: ${imageUrl}`);
//   } catch (error) {
//     console.error('Error deleting file from S3:', error);
//     throw new Error('Could not delete file from S3');
//   }
//   try {
//     await this.visitPlaceImageRepository.remove(imageRecord);
//     console.log('Image record deleted from database');
//     return { message: 'Image deleted successfully from S3 and database' };
//   } catch (error) {
//     console.error('Error deleting record from database:', error);
//     throw new Error('Could not delete record from database');
//   }
// }


// !!!!!!!!---------------------Google Upload link generate and upload the existing picture and delete it -----------------!!!!
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



}
