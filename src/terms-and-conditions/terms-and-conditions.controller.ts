import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';
@ApiTags('Terms And Conditions')
@Controller('termsAndConditions')
export class TermsAndConditionsController {
  constructor(
    private readonly termsAndConditionsService: TermsAndConditionsService,
  ) {}
  @Get('site/api/:catagory')
  findAllsite(@Param('catagory') catagory:string) {
    return this.termsAndConditionsService.findAllSite(catagory);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(AdmintokenGuard)
  @Patch('admin/site/api/:catagory')
  updatesite(
    @Param('catagory') catagory:string,
    @Body() updateTermsAndConditionDto: UpdateTermsAndConditionDto,
  ) {
    return this.termsAndConditionsService.updateSite(updateTermsAndConditionDto,catagory
    );
  }

}
