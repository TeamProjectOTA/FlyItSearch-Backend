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
import {
  CreateIntroductionDto,
  CreateOverviewDto,
  CreateTourPackageDto,
  CreateVisitPlaceDto,
} from './dto/create-tour-package.dto';
import { ApiTags } from '@nestjs/swagger';
import { multerConfig } from './mutlar/multer.config';
import { MulterFile } from './mutlar/multer-file.interface';
import { TourPackage } from './entities/tour-package.entity';

@ApiTags('Tour-Package')
@Controller('tour-packages')
export class TourPackageController {
  constructor(private readonly tourPackageService: TourPackageService) {}

  @Post('/introduction')
  async createIntroduction(
    @Body() createIntroductionDto: CreateIntroductionDto,
  ) {
    return await this.tourPackageService.createIntorduction(
      createIntroductionDto,
    );
  }
  @Post('/overview')
  async createOverview(@Body() createOverviewDto: CreateOverviewDto) {
    return await this.tourPackageService.createOverview(createOverviewDto);
  }

  @Post('/mainImage')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadPicturesmain(@UploadedFiles() files: MulterFile[]): Promise<any> {
    const results = [];

    for (const file of files) {
      const savedPicture = await this.tourPackageService.createMainImage(file);
      results.push({
        id: savedPicture.id,
        name: savedPicture.mainTitle,
        path: savedPicture.path,
        size: savedPicture.size,
      });
    }

    return results;
  }

  @Post('/visitPlace')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadPicturesVisit(
    @UploadedFiles() files: MulterFile[],
  ): Promise<any> {
    const results = [];

    for (const file of files) {
      const savedPicture = await this.tourPackageService.createVisitImage(file);
      results.push({
        id: savedPicture.id,
        path: savedPicture.path,
        size: savedPicture.size,
      });
    }

    return results;
  }

  @Post()
  async create(
    @Body() createTourPackageDto: CreateTourPackageDto,
  ): Promise<TourPackage> {
    return this.tourPackageService.create(createTourPackageDto);
  }

  @Get()
  async findAll() {
    return this.tourPackageService.findAll();
  }
}
