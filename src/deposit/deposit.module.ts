import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit, Wallet } from './deposit.model';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { Transection } from 'src/transection/transection.model';


@Module({
  imports: [
    TypeOrmModule.forFeature([Deposit, User, Wallet, Transection,]),
    UserModule,
    AuthModule,
  ],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
