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

  async uploadBannerAndSlider(
    files: {
      banner?: Express.Multer.File[];
      slider?: Express.Multer.File[];
    },
    data: dataDto,
  ) {
    let bannerData: { imageUrl: string; size: string; type: string } | null = null;
    const sliderImages = [];

    const homePage = await this.homePageRepository.findOne({
      where: { id: 1 },
    });
    if (!homePage) {
      throw new NotFoundException('HomePage record not found.');
    }
    if (files.banner && files.banner.length > 0) {
      const bannerFile = files.banner[0];
      if (homePage.banner && homePage.banner.imageUrl) {
        await this.deleteFileFromGoogleCloud(homePage.banner.imageUrl);
      }
      bannerData = await this.uploadFileToGoogleCloud(bannerFile);
    } else if (homePage.banner) {
      bannerData = homePage.banner;
    }

    
    if (files.slider && files.slider.length > 0) {
      if (homePage.sliderImage && homePage.sliderImage.length > 0) {
        for (const sliderImage of homePage.sliderImage) {
          await this.deleteFileFromGoogleCloud(sliderImage.imageUrl);
        }
      }
      for (const sliderFile of files.slider) {
        const sliderImageData = await this.uploadFileToGoogleCloud(sliderFile);
        sliderImages.push(sliderImageData);
      }
    } else if (homePage.sliderImage) {
      sliderImages.push(...homePage.sliderImage);
    }

  
    if (!bannerData) {
      throw new BadRequestException('Banner image is required.');
    }
    if (sliderImages.length > 5) {
      throw new BadRequestException('A maximum of 5 slider images are allowed.');
    }

    // Update home page fields
    homePage.banner = bannerData;
    homePage.sliderImage = sliderImages;
    homePage.mainTitle = data.maintitle;
    homePage.subTitle = data.subtitle;

    return this.homePageRepository.save(homePage);
  }


  async uploadFileToGoogleCloud(
    file: Express.Multer.File,
  ): Promise<{ imageUrl: string; size: string; type: string }> {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
      throw new BadRequestException(
        'Invalid file type. Only JPG, JPEG, and PNG files are allowed.',
      );
    }

    const fileSizeKB = (file.size / 1024).toFixed(2);
    const folderName = 'SiteHomePage';
    const fileName = `${folderName}/${uuidv4()}${fileExtension}`;
    const bucketFile = this.bucket.file(fileName);

    try {
      await bucketFile.save(file.buffer, {
        contentType: file.mimetype,
        public: true,
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to upload file to Google Cloud: ${error.message}`,
      );
    }

    const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
    return {
      imageUrl: publicUrl,
      size: `${fileSizeKB} KB`,
      type: fileExtension,
    };
  }

  async deleteFileFromGoogleCloud(imageUrl: string): Promise<void> {
    const fileName = imageUrl.split('/').pop();
    const file = this.bucket.file(fileName);

    try {
      await file.delete();
      console.log(`Successfully deleted file: ${fileName}`);
    } catch (error) {
      console.error(`Failed to delete file: ${fileName}`, error.message);
      throw new BadRequestException(
        `Failed to delete previous file: ${error.message}`,
      );
    }
  }
  async getalldata() {
    const homapage= await this.homePageRepository.findOne({ where: { id: 1 } });
    if (!homapage) {
      throw new NotFoundException('HomePage record not found.');
    }
    return homapage
   
  }
}
