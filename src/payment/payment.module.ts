import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSave } from 'src/book/booking.model';
import { Transection } from 'src/transection/transection.model';
import { TransectionModule } from 'src/transection/transection.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { Wallet } from 'src/deposit/deposit.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingSave, Transection, User, Wallet]),
    TransectionModule,
    UserModule,
    AuthModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
