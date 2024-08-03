import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight, Segment } from './flight.model';
import { BookingService } from './booking.service';
import { AirportsModule } from 'src/airports/airports.module';
import { AirlinesModule } from 'src/airlines/airlines.module';
import { HttpModule } from '@nestjs/axios';
import { BDFareService } from './API Utils/bdfare.flights.service';
import { SabreUtils } from './API Utils/sabre.utils';
import { SabreService } from './API Utils/sabre.flights.service';
import { FlyHubService } from './API Utils/flyhub.flight.service';
import { FlyHubUtil } from './API Utils/flyhub.util';
import { Test } from './API Utils/test.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BookService } from 'src/book/book.service';
import { LagInfo, SaveBooking } from 'src/book/book.model';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Flight, Segment, Admin, SaveBooking, User, LagInfo]),
    HttpModule,
    AirportsModule,
    AirlinesModule,
    AuthModule,
   
    
    
  ],
  controllers: [FlightController],
  providers: [
    FlyHubUtil,
    FlightService,
    SabreService,
    BookingService,
    SabreUtils,
    BDFareService,
    FlyHubService,
    Test,
    BookService
  ],

  exports: [FlyHubService, FlyHubUtil, Test],
})
export class FlightModule {}
