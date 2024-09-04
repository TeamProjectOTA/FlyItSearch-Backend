import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSave } from 'src/book/booking.model';
import { BookingModule } from 'src/book/booking.module';

@Module({
  imports:[TypeOrmModule.forFeature([BookingSave])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
