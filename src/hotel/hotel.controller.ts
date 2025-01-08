import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { SabreHotel } from './API Utils/sabre.hotel.service';
import { ApiTags } from '@nestjs/swagger';
import { GetHotelAvailRQDto, RootDto } from './DTO/hoteldto';
import { Response } from 'express';

@ApiTags('Hotel api')
@Controller('hotel')
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly sabreHotel: SabreHotel,
  ) {}

  @Post('/sabre')
  async hotelRequest(@Body() hoteldto: RootDto) {
    return await this.sabreHotel.sabreHotelRequest(hoteldto);
  }

  @Get('ip')
  async getIp() {
    return this.hotelService.getIp();
  }
  @Get()
  async redirectUrl(@Res() res: Response): Promise<void> {
    const url = await this.hotelService.getRedirectUrl(); // Call the service to get the URL
    res.redirect(url); // Redirect the user
  }
}
