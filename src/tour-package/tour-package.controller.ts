import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TourPackageService } from './tour-package.service';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('tour-packages')
export class TourPackageController {
  constructor(private readonly tourPackageService: TourPackageService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createTourPackageDto: CreateTourPackageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const images = files.map((file) => ({
      path: `/uploads/${file.filename}`,
      size: file.size,
      description: '',
      mainTitle: '',
    }));

    createTourPackageDto.mainImage = images.filter(
      (_, index) => index < createTourPackageDto.mainImage.length,
    );
    createTourPackageDto.visitPlace.forEach((visitPlace, index) => {
      if (images[createTourPackageDto.mainImage.length + index]) {
        visitPlace.path =
          images[createTourPackageDto.mainImage.length + index].path;
        visitPlace.size =
          images[createTourPackageDto.mainImage.length + index].size;
      }
    });

    return this.tourPackageService.create(createTourPackageDto);
  }

  @Get()
  async findAll() {
    return this.tourPackageService.findAll();
  }
}
