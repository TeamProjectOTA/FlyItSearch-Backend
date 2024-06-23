import { Module } from '@nestjs/common';
import { AirlinesController } from './airlines.controller';
import { AirlinesService } from './airlines.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlinesModel } from './airlines.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AirlinesModel]), AuthModule],
  controllers: [AirlinesController],
  providers: [AirlinesService],
  exports: [AirlinesService],
})
export class AirlinesModule {}
