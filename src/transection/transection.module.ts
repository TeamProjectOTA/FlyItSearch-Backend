import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Transection } from './transection.model';

@Module({
  imports: [TypeOrmModule.forFeature([Transection])],
})
export class TransectionModule {}
