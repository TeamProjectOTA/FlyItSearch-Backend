import { Module } from '@nestjs/common';
import { TravelBuddyService } from './travel-buddy.service';
import { TravelBuddyController } from './travel-buddy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelBuddy } from './travel-buddy.model';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TravelBuddy, User]),
    UserModule,
    AuthModule,
  ],
  controllers: [TravelBuddyController],
  providers: [TravelBuddyService],
})
export class TravelBuddyModule {}
