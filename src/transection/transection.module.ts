import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transection } from './transection.model';
import { TransectionService } from './transection.service';
import { AuthModule } from 'src/auth/auth.module';
import { BookingSave } from 'src/book/booking.model';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/deposit/deposit.model';
import { TransectionController } from './transection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transection, BookingSave,User,Wallet]), AuthModule],
  providers: [TransectionService],
  exports: [TransectionService],
  controllers:[TransectionController]
})
export class TransectionModule {}
