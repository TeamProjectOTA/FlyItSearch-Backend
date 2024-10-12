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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {  memoryStorage } from 'multer';
import {  ApiTags } from '@nestjs/swagger';
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
  @Post(':bookingId/upload')
  @UseInterceptors(FilesInterceptor('files', 2)) 
  async uploadVisaAndPassport(
    @Param('bookingId') bookingId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if(!files){
      throw new BadRequestException('no file is given');
    }
    if (files.length !== 2) {
      throw new BadRequestException('Exactly two files (passport and visa) are required');
    }
    const passportFile = files[0];
    const visaFile = files[1];
    return this.uploadsService.uploadVisaAndPassportImages(bookingId, passportFile, visaFile);
  }
}
