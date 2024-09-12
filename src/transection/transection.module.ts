import { Module } from '@nestjs/common';
import { TransectionService } from './transection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transection } from './transection.model';

@Module({
  imports: [TypeOrmModule.forFeature([Transection])],
  providers: [TransectionService],
})
export class TransectionModule {}
