import { Module } from '@nestjs/common';

import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSave, LagInfo, SaveBooking } from './booking.model';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlightModule } from 'src/flight/flight.module';
import { Admin } from 'src/admin/entities/admin.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FlyHubUtil } from 'src/flight/API Utils/flyhub.util';
import { BookingController } from './booking.controller';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, SaveBooking, User, LagInfo,BookingSave]),
    UserModule,
    AuthModule,
    FlightModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, FlyHubService, FlyHubUtil,MailService],
  exports: [BookingService],
})
export class BookingModule {}
