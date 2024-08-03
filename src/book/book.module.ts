import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  LagInfo, SaveBooking } from './book.model';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlightModule } from 'src/flight/flight.module';
import { Admin } from 'src/admin/entities/admin.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FlyHubUtil } from 'src/flight/API Utils/flyhub.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, SaveBooking, User, LagInfo]),
    UserModule,
    AuthModule,
    FlightModule,
  ],
  controllers: [BookController],
  providers: [BookService, FlyHubService,FlyHubUtil],
  exports: [BookService],
})
export class BookModule {}
