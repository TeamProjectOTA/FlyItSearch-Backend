import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { VisaService } from './visa.service';
import { VisaAllDto } from './dto/visa-all.dto';

@Controller('visa')
export class VisaController {
  constructor(private readonly visaService: VisaService) { 
  }

  @Post()
  create(@Body() visaAllDto: VisaAllDto) {
    return this.visaService.createVisaAll(visaAllDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1, // Default to page 1 if not provided
    @Query('limit') limit: number = 10 // Default to 10 items per page if not provided
  ) {
    // Ensure limit doesn't exceed a reasonable value (e.g., 100)
    limit = Math.min(limit, 100);
    return this.visaService.findAll(page, limit);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.visaService.findOne(id);
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.visaService.deleteVisa(id);
  }
}
