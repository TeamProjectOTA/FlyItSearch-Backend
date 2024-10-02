import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { Agents } from 'src/agents/entities/agents.entity';
import { AgentsModule } from 'src/agents/agents.module';
import { BookingSave } from 'src/book/booking.model';
import { Transection } from 'src/transection/transection.model';
import { Wallet } from 'src/deposit/deposit.model';
import { TransectionModule } from 'src/transection/transection.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      User,
      Agents,
      BookingSave,
      Transection,
      Wallet,
    ]),
    UserModule,
    AuthModule,
    AgentsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
