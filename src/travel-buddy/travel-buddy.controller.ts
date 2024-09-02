import { Body, Controller, Delete, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { TravelBuddyService } from './travel-buddy.service';
import { TravelBuddyDto } from './travel-buddy.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';
@ApiTags('Tarvel Buddy')
@Controller('travel-buddy')
export class TravelBuddyController {
  constructor(private readonly travelBuddyService: TravelBuddyService) {}




 @ApiBearerAuth('access_token')
 @UseGuards(UserTokenGuard)
 @Post('/saveTravelBuddy')
  async createTravelBuddy(@Body() createTravelBuddyDto:TravelBuddyDto, @Headers() header:Headers){
  return await this.travelBuddyService.createTravelBuddy(createTravelBuddyDto,header)
  }

  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Delete('/deleteTravelBuddy/:id')
  async deleteTravelBuddy(@Param('id') id:number){
    console.log(id)
    return await this.travelBuddyService.deleteTravelBuddy(id)
  }
}
