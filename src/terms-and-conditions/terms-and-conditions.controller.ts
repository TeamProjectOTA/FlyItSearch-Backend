import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { CreateTermsAndConditionDto } from './dto/create-terms-and-condition.dto';
import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Terms And Conditions')
@Controller('terms-and-conditions')
export class TermsAndConditionsController {
  constructor(private readonly termsAndConditionsService: TermsAndConditionsService) {}
  @Get()
  findAll() {
    return this.termsAndConditionsService.findAll();
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTermsAndConditionDto: UpdateTermsAndConditionDto) {
    return this.termsAndConditionsService.update(+id, updateTermsAndConditionDto);
  }

}
