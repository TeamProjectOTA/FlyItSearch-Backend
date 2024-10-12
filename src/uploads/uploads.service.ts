import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePicture, VisaPassport } from './uploads.model';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import path, { extname, join } from 'path';
import { promises as fs } from 'fs';
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
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository:Repository<BookingSave>,
    @InjectRepository(VisaPassport)
    private readonly visaPassportRepository:Repository<VisaPassport>
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


  async uploadVisaAndPassportImages(bookingId: string, passportFile: Express.Multer.File, visaFile: Express.Multer.File) {
    const bookingSave = await this.bookingSaveRepository.findOne({
      where: { bookingId: bookingId },
      relations: ['visaPassport'], 
    });

    if (!bookingSave) {
      throw new BadRequestException('Booking not found');
    }
    if (bookingSave.visaPassport) {
      throw new ConflictException('You can only upload the visa and passport copy once');
    }

    
    const [passportLink, visaLink] = await Promise.all([
      this.uploadImage(passportFile, `${bookingSave.bookingId}-passport`),
      this.uploadImage(visaFile, `${bookingSave.bookingId}-visa`),
    ]);
    const visaPassport = new VisaPassport();
    visaPassport.passportLink = passportLink;
    visaPassport.visaLink = visaLink;
    visaPassport.bookingSave = bookingSave;

    return await this.visaPassportRepository.save(visaPassport);
  }

  private async uploadImage(file: Express.Multer.File, type: string): Promise<string> {
    const folderName = 'PassportVisa';
    const fileName = `${folderName}/${type}`;
    const blob = this.storage.bucket(this.bucket).file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
      public: true, 
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket}/${fileName}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }

  
}
