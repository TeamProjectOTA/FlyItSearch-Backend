import { Module } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardController } from './admin-dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSave } from 'src/book/booking.model';
import { Deposit } from 'src/deposit/deposit.model';
import { AuthModule } from 'src/auth/auth.module';
import { NewTicket } from './admin-dashboard.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingSave, Deposit, NewTicket]),
    AuthModule,
  ],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class AdminDashboardModule {}
