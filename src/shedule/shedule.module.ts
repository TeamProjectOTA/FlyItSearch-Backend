import { Module } from '@nestjs/common';
import { Shedule } from './shedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSave } from 'src/book/booking.model';
import { BookingIdSave } from 'src/flight/flight.model';

@Module({
  imports: [TypeOrmModule.forFeature([BookingSave, BookingIdSave])],
  providers: [Shedule],
})
export class SheduleModule {}
