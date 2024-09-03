import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingIdSave, Flight, Segment } from './flight.model';
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
import { User } from 'src/user/entities/user.entity';
import { BookingSave } from 'src/book/booking.model';
import { BookingService } from 'src/book/booking.service';
import { BookingServicesbr } from './booking.service';
import { PaymentModule } from 'src/payment/payment.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Flight,
      Segment,
      Admin,
      User,
      BookingSave,
      BookingIdSave,
    ]),
    HttpModule,
    AirportsModule,
    AirlinesModule,
    AuthModule,
    PaymentModule,
    MailModule,
  ],
  controllers: [FlightController],
  providers: [
    FlyHubUtil,
    FlightService,
    SabreService,
    BookingServicesbr,
    SabreUtils,
    BDFareService,
    FlyHubService,
    Test,
    BookingService,
  ],

  exports: [FlyHubService, FlyHubUtil],
})
export class FlightModule {}
