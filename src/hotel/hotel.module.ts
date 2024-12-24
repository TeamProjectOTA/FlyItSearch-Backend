import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { SabreHotel } from './API Utils/sabre.hotel.service';

@Module({
  controllers: [HotelController],
  providers: [HotelService,SabreHotel],
})
export class HotelModule {}
