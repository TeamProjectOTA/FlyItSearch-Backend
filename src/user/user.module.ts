import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Transection } from 'src/transection/transection.model';
import { IpModule } from 'src/ip/ip.module';
import { IpAddress } from 'src/ip/ip.model';
import { BookingSave } from 'src/book/booking.model';
import { BookingModule } from 'src/book/booking.module';
import { TravelBuddy } from 'src/travel-buddy/travel-buddy.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Transection,
      IpAddress,
      BookingSave,
      TravelBuddy,
    ]),
    AuthModule,
    IpModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
