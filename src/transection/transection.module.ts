import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transection } from './transection.model';
import { TransectionService } from './transection.service';
import { AuthModule } from 'src/auth/auth.module';
import { BookingSave } from 'src/book/booking.model';

@Module({
  imports: [TypeOrmModule.forFeature([Transection,BookingSave]),AuthModule],
  providers:[TransectionService],
  exports:[TransectionService]
})
export class TransectionModule {}
