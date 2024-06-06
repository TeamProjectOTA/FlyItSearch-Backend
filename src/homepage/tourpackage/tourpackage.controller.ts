import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TourpackageService } from './tourpackage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Category, Tourpackage, TourpackageDto } from './tourpackage.model';
import { ApiTags } from '@nestjs/swagger';
import { get } from 'http';

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

  @Get('/:category')
  findAll(@Param('category')category:string) {
    return this.tourpackageService.findAll(category);
  }


  // @Get('/flight')
  // findAllFlight() {
  //   const category = 'Flight';
  //   return this.tourpackageService.findByFlight(category);
  // }


  // @Get('/hotel')
  // findAllHotel(){
  //   const category = 'Hotel';
  //   return this.tourpackageService.findByHotel(category)
  // }

  // @Get('/group-fare')
  // findAllGroupFare(){
  //   const category = 'Group Fare';
  //   return this.tourpackageService.findByGroupFare(category)
  // }

  // @Get('/tour')
  // findAllTour(){
  //   const category = 'Tour';
  //   return this.tourpackageService.findByTour(category)
  // }

}
