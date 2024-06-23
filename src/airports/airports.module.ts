import { Module } from '@nestjs/common';
import { AirportsController } from './airports.controller';
import { AirportsService } from './airports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportsModel } from './airports.model';
import { AirlinesService } from 'src/airlines/airlines.service';

@Module({
  imports: [TypeOrmModule.forFeature([AirportsModel])],
  controllers: [AirportsController],
  providers: [AirportsService],
  exports: [AirportsService],
})
export class AirportsModule {}
