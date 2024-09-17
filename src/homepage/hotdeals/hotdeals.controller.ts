import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { ApiTags } from '@nestjs/swagger';
import { readdirSync } from 'fs';
import { HotDealsService } from './hotdeals.service';
import { HotDeals, HotDealsDto } from './hotdeals.model';
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

@ApiTags('Hotdeals-Api')
@Controller('hotdeals')
export class HotDealsController {
  constructor(private readonly tourpackageService: HotDealsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './src/AllFile/HotDeals',
        filename: (req, file, callback) => {
          const name = Date.now();
          const filename = `hotdeals-${name}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only picture files are allowed!'),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Body() tourpackageDto: HotDealsDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<HotDeals> {
    const fileDetails = files.map((file) => ({
      path: file.path,
      size: file.size,
    }));
    const filenames = files.map((file) => file.filename);
    tourpackageDto.picture = filenames.join(',');
    return await this.tourpackageService.create(
      tourpackageDto,
      filenames,
      fileDetails,
    );
  }

  @Get('/:category')
  async findOne(@Param('category') category: string) {
    return await this.tourpackageService.findOne(category);
  }
  @Delete('/delete/:title')
  Delete(@Param('title') title: string) {
    return this.tourpackageService.Delete(title);
  }
}
