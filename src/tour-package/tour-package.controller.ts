import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TourPackage } from './entities/tourPackage.model';

import { TourPackageService } from './tour-package.service';
import { CreateTourPackageDto } from './dto/tourPackage.dto';
@ApiTags('Tour-Package')
@Controller('tour-packages')
export class TourPackageController {
  constructor(private readonly tourPackageService: TourPackageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tour package' })
  @ApiResponse({
    status: 201,
    description: 'The tour package has been successfully created.',
    type: TourPackage,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
  })
  async create(@Body() createTourPackageDto: CreateTourPackageDto): Promise<TourPackage> {
    return this.tourPackageService.create(createTourPackageDto);
  }
}
