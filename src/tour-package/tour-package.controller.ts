import {
  Body,
  Controller,
  Get,
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
  @ApiResponse({ status: 201, description: 'Tour package successfully created', type: TourPackage })
  async create(@Body() createTourPackageDto: CreateTourPackageDto): Promise<TourPackage> {
    return this.tourPackageService.create(createTourPackageDto);
  }
  @Get()
  async findAll(): Promise<TourPackage[]> {
    return this.tourPackageService.findAll();
  }
}
