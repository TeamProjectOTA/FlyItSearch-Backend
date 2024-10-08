import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
  Delete,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {  memoryStorage } from 'multer';
import {  ApiTags } from '@nestjs/swagger';
@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @Post('upload/')
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


}
