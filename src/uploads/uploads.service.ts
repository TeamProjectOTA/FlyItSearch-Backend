import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePicture } from './uploads.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import path, { extname, join } from 'path';
import { promises as fs, link } from 'fs';
import { AuthService } from 'src/auth/auth.service';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { BookingSave } from 'src/book/booking.model';

@Injectable()
export class UploadsService {
  private storage: Storage;
  private bucket: string;
  constructor(
    @InjectRepository(ProfilePicture)
    private profilePictureRepository: Repository<ProfilePicture>,
    private readonly authservice: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
    });
    this.bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME;
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
      let fileDeleted = false;

      try {
        const bucketFile = this.storage
          .bucket(this.bucket)
          .file(existingProfilePicture.filename);

        await bucketFile.delete();
        fileDeleted = true;
      } catch (error) {
        if (error.code === 404) {
          console.warn(
            'File not found in Google Cloud bucket. Proceeding with database deletion.',
          );
        } else {
          console.error(
            'Error deleting file from Google Cloud:',
            error.message,
          );
          throw new BadRequestException(
            'Failed to delete the profile picture file from Google Cloud.',
          );
        }
      }

      try {
        await this.profilePictureRepository.remove(existingProfilePicture);
      } catch (error) {
        throw new BadRequestException(
          'Failed to delete the profile picture from the database.',
        );
      }
    }

    const fileExtension = extname(file.originalname);
    const folderName = 'ProfilePicture';
    const filename = `${folderName}/${user.passengerId}-ProfilePicture${uuidv4()}${fileExtension}`;

    try {
      const bucketFile = this.storage.bucket(this.bucket).file(filename);

      await bucketFile.save(file.buffer, {
        contentType: file.mimetype,
        public: true,
      });

      const publicUrl = `https://storage.googleapis.com/${this.bucket}/${filename}`;

      const profilePicture = this.profilePictureRepository.create({
        user,
        filename,
        link: publicUrl,
        size: file.size,
      });
      const save = await this.profilePictureRepository.save(profilePicture);
      return {
        Message: 'Image Uploaded Successful',
        save: { link: save.link, size: save.size },
      };
    } catch (error) {
      console.error('Error uploading file to Google Cloud:', error.message);
      throw new BadRequestException(
        'Failed to upload and save profile picture.',
      );
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const random = `${timestamp}${randomNumber}`;
    const folderName = 'PassportVisa';
    const fileExtension = extname(file.originalname);
    const fileName = `${folderName}/${random}-image${fileExtension}`;
    const blob = this.storage.bucket(this.bucket).file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
      public: true,
    });

    const link = await new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket}/${fileName}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
    return { link: link };
  }

  // async test(file:any){
  //   const guideId = guide.uid;
  //  const filetype = (file.originalname).split('.')[1];
  //  const keyvalue = 'photo/'+guideId + '.' + filetype;

  //  const params = {
  //    Bucket: process.env.BUCKET_NAME,
  //    Key: keyvalue,
  //    Body: file.buffer,
  //    ACL: 'public-read',
  //    ContentType: file.mimetype
  //  };

  //  this.s3.putObject(params, (err, data) => {
  //    if (err) { 
  //      res.status(500).json({ status: 'error', message: 'Something Error In Code'});
  //    } else {
  //      const url = process.env.CDN_SPACES +'/'+ keyvalue;

  //      guide['profile']= url;
  //      this.guideRepository.update(guide.id, guide);
  //      res.status(201).json({ status: 'success', message: 'Logo uploaded successfully', fileurl: url });
  //    }
  //  });

  // }
}
