import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HomepageService } from './homepage.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';
import { dataDto } from './homepage.model';
@ApiTags('Homepage-Api')
@Controller('homepage')
export class HomepageController {
  constructor(private readonly homePageService: HomepageService) {}
  @UseGuards(AdmintokenGuard)
  @Post('/uploadDocuments')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG and PNG are allowed.',
      );
    }
    if (file.size > maxSize) {
      throw new BadRequestException(
        'File size exceeds the maximum limit of 5MB.',
      );
    }
    return this.homePageService.uploadImage(file);
  }
}
