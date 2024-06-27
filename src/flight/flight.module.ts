import { Module, } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight, Segment } from './flight.model';
import { SabreService } from './sabre.flights.service';
import { BookingService } from './booking.service';
import { SabreUtils } from './sabre.utils';
import { AirportsModule } from 'src/airports/airports.module';
import { AirlinesModule } from 'src/airlines/airlines.module';
import { BDFareService } from './bdfare.flights.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Flight, Segment]),HttpModule,
    AirportsModule,
    AirlinesModule,
  ],
  controllers: [FlightController],
  providers: [FlightService, SabreService, BookingService, SabreUtils,BDFareService],
})
export class FlightModule {}
