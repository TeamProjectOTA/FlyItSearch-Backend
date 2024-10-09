import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePicture } from './uploads.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import path, { extname, join } from 'path';
import { promises as fs } from 'fs';
import { AuthService } from 'src/auth/auth.service';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';



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
  
  async create(
    header: any,
    file: Express.Multer.File,
  ): Promise<any> {
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
        const bucketFile = this.storage
          .bucket(this.bucket)
          .file(existingProfilePicture.filename);
        await bucketFile.delete();
        await this.profilePictureRepository.remove(existingProfilePicture);
      } catch (error) {
        console.error('Error deleting file from Google Cloud:', error.message);
        throw new BadRequestException('Failed to delete existing profile picture.');
      }
    }
  
    const fileExtension = extname(file.originalname);
    const folderName = 'ProfilePicture';
    const filename = `${folderName}/${user.passengerId}-ProfilePicture${fileExtension}${uuidv4()}`;
  
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
     const save= await this.profilePictureRepository.save(profilePicture)
      return {Message:"Image Uploaded Successful",save} ;
    } catch (error) {
      console.error('Error uploading file to Google Cloud:', error.message);
      throw new BadRequestException('Failed to upload and save profile picture.');
    }
  }
  
}
