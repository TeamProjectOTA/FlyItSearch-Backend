import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { SabreHotel } from './API Utils/sabre.hotel.service';
import { SabreHotelUtils } from './API Utils/sabre.hotel.util';

@Module({
  controllers: [HotelController],
  providers: [HotelService,SabreHotel,SabreHotelUtils],
})
export class HotelModule {}
