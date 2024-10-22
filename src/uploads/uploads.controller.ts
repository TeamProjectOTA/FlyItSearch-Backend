import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
  Param,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';
@ApiTags('Uploads')
@Controller('upload')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @UseGuards(UserTokenGuard)
  @Post('profilePicture/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpg',
          'image/png',
          'image/jpeg',
          'image/gif',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('File type must be jpeg, jpg, png, gif'),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @Headers() header: Headers,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded or invalid file format.');
    }

    return await this.uploadsService.create(header, file);
  }

  @UseGuards(UserTokenGuard)
  @Post('/uploadDocuments')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadVisaAndPassport(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const visaImg = files.find(file => file.fieldname === 'visaImg');
    const passImg = files.find(file => file.fieldname === 'passImg');
    if (!passImg || !visaImg) {
      throw new BadRequestException('Both visaImg and passImg files are required');
    }
    const allowedTypes = ['image/jpeg', 'image/png','image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  
    // Validate visaImg
    if (!allowedTypes.includes(visaImg.mimetype)) {
      throw new BadRequestException('Invalid file type for visaImg. Only JPEG and PNG are allowed.');
    }
    if (visaImg.size > maxSize) {
      throw new BadRequestException('visaImg file size exceeds the maximum limit of 5MB.');
    }
  
    // Validate passImg
    if (!allowedTypes.includes(passImg.mimetype)) {
      throw new BadRequestException('Invalid file type for passImg. Only JPEG and PNG are allowed.');
    }
    if (passImg.size > maxSize) {
      throw new BadRequestException('passImg file size exceeds the maximum limit of 5MB.');
    }

    return this.uploadsService.uploadVisaAndPassportImages(passImg, visaImg);
  }
}
