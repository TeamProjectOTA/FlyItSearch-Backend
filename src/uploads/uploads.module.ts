import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePicture } from './uploads.model';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { BookingSave } from 'src/book/booking.model';
import { DoSpacesServicerovider } from './upload.provider.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfilePicture, User, BookingSave]),
    UserModule,
    AuthModule,
  ],
  controllers: [UploadsController],
  providers: [UploadsService,DoSpacesServicerovider],
  exports:[DoSpacesServicerovider]
})
export class UploadsModule {}
