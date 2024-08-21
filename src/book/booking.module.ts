import { Module } from '@nestjs/common';

import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSave } from './booking.model';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlightModule } from 'src/flight/flight.module';
import { Admin } from 'src/admin/entities/admin.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FlyHubUtil } from 'src/flight/API Utils/flyhub.util';
import { BookingController } from './booking.controller';
import { MailService } from 'src/mail/mail.service';
import { PaymentModule } from 'src/payment/payment.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin,  User, BookingSave]),
    UserModule,
    AuthModule,
    FlightModule
  ],
  controllers: [BookingController],
  providers: [BookingService, ],
  exports: [BookingService],
})
export class BookingModule {}
