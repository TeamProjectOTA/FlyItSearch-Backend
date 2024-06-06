import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TourpackageService } from './tourpackage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Tourpackage, TourpackageDto } from './tourpackage.model';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Hotdeals-Api')
@Controller('hotdeals')
export class TourpackageController {
  constructor(private readonly tourpackageService: TourpackageService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './src/AllFile/HotDeals',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() tourpackageDto: TourpackageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Tourpackage> {
    return this.tourpackageService.create(tourpackageDto, file.filename);
  }
  @Get("/flight")
  findAllFlight(){
    const category='Flight'
    return this.tourpackageService.findByFlight(category)
  }
  @Get('/all-hotdeals')
  findAll(){
    return this.tourpackageService.findAll()
  }

}
