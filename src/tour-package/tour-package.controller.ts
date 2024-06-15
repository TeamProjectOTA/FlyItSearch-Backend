import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Tour-package-Api')
@Controller('tour-package')
export class TourPackageController {
  constructor(private readonly tourPackageService: TourPackageService) {}

  @Post()
  create(@Body() createTourPackageDto: CreateTourPackageDto) {
    return this.tourPackageService.create(createTourPackageDto);
  }

  @Get()
  findAll() {
    return this.tourPackageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourPackageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourPackageDto: UpdateTourPackageDto) {
    return this.tourPackageService.update(+id, updateTourPackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourPackageService.remove(+id);
  }
}
