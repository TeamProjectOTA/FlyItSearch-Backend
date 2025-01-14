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

@ApiTags('Tour-Package')
@Controller('tour-packages')
export class TourPackageController {}
