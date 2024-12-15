import { Module } from '@nestjs/common';
import { BankAddService } from './bank-add.service';
import { BankAddController } from './bank-add.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAdd } from './bank-add.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankAdd]),AuthModule],
  controllers: [BankAddController],
  providers: [BankAddService],
})
export class BankAddModule {}
