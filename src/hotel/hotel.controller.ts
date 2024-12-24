import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { SabreHotel } from './API Utils/sabre.hotel.service';
import { ApiTags } from '@nestjs/swagger';
import { GetHotelAvailRQDto, RootDto } from './DTO/hoteldto';

@ApiTags('Hotel api')
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService,private readonly sabreHotel:SabreHotel) {

  
  }
  @Get("/token")
  async testToken(){
    return await this.sabreHotel.restToken()
  }

  @Post('/sabre')
  async hotelRequest(@Body() hoteldto:RootDto){
    return await this.sabreHotel.sabreHotelRequest(hoteldto)
  }

  
}
