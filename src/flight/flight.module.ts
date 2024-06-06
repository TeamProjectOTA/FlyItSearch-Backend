import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight, Segment } from './flight.model';

@Module({
  imports: [TypeOrmModule.forFeature([Flight, Segment])],
  controllers: [FlightController],
  providers: [FlightService],
})
export class FlightModule {}
