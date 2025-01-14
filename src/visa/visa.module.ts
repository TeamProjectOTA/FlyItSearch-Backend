import { Module } from '@nestjs/common';
import { VisaService } from './visa.service';
import { VisaController } from './visa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visa } from './entity/visa.entity';
import { DurationCost } from './entity/duration-cost.entity';
import { VisaRequiredDocuments } from './entity/visa-required-documents.entity';

@Module({imports:[TypeOrmModule.forFeature([Visa,DurationCost,VisaRequiredDocuments])],
  controllers: [VisaController],
  providers: [VisaService],
})
export class VisaModule {}
