import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePicture, VisaPassport } from './uploads.model';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { BookingSave } from 'src/book/booking.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfilePicture, User, BookingSave, VisaPassport]),
    UserModule,
    AuthModule,
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
