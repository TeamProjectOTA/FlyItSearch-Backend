import { Module } from '@nestjs/common';
import { BankAddService } from './bank-add.service';
import { BankAddController } from './bank-add.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAdd } from './bank-add.model';

@Module({
  imports: [TypeOrmModule.forFeature([BankAdd])],
  controllers: [BankAddController],
  providers: [BankAddService],
})
export class BankAddModule {}
