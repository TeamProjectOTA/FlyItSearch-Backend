import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dataDto, HomePage } from './homepage.model';
import { Repository } from 'typeorm';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class HomepageService {
  private storage: Storage;
  private bucket: any;

  constructor(
    @InjectRepository(HomePage)
    private readonly homePageRepository: Repository<HomePage>,
  ) {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
    });
    this.bucket = this.storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
  }
  async uploadImage(file: Express.Multer.File): Promise<any> {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const random = `${timestamp}${randomNumber}`;
    const folderName = 'SiteHomePage';
    const fileName = `${folderName}/${random}-image`;
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

  async create(){}
}
