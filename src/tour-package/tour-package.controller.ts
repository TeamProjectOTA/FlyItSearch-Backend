import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFiles,
  Param,
  ParseIntPipe,
  Delete,
  Query,
  NotFoundException,
  Logger,
  HttpException,
  HttpStatus,
  NotAcceptableException,
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
  private readonly logger = new Logger(TourPackageController.name);
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
    @Body() createTourPackageDtoArray: CreateTourPackageDto[],
  ): Promise<any> {
    const createdPackages = await Promise.all(
      createTourPackageDtoArray.map((dto) =>
        this.tourPackageService.create(dto),
      ),
    );
    if (!createdPackages) {
      throw new NotAcceptableException();
    }
    return createdPackages;
  }

  @Get(":uuid")
  async findAll(@Param('uuid')uuid:string) {
    const tourpackage = await this.tourPackageService.findAll(uuid);
    return tourpackage;
  }
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    return this.tourPackageService.delete(id);
  }

  @Get('search')
  async findAllByCriteria(
    @Query('mainTitle') mainTitle?: string,
    @Query('countryName') countryName?: string,
    @Query('cityName') cityName?: string,
    @Query('metaKeywords') metaKeywords?: string,
    @Query('startDate') startDate?: string,
  ): Promise<TourPackage[]> {
    const metaKeywordsArray = metaKeywords
      ? metaKeywords.split(',').map((keyword) => keyword.trim())
      : undefined;

    //this.logger.debug(`Received search criteria: mainTitle=${mainTitle}, countryName=${countryName}, cityName=${cityName}, metaKeywords=${metaKeywordsArray}`);

    const criteria = {
      mainTitle,
      countryName,
      cityName,
      metaKeywords: metaKeywordsArray,
      startDate,
    };

    try {
      return await this.tourPackageService.findAllByCriteria(criteria);
    } catch (error) {
      //this.logger.error(`Error finding tour packages: ${error.message}`);
      throw new NotFoundException(error.message);
    }
  }
}
