// visa.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VisaAllDto } from './dto/visa-all.dto';
import { Visa } from './entity/visa.entity';
import { DurationCost } from './entity/duration-cost.entity';
import { VisaRequiredDocuments } from './entity/visa-required-documents.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class VisaService {
  constructor(
    @InjectRepository(Visa)
    private readonly visaRepository: Repository<Visa>,

    @InjectRepository(DurationCost)
    private readonly durationCostRepository: Repository<DurationCost>,

    @InjectRepository(VisaRequiredDocuments)
    private readonly visaRequiredDocumentsRepository: Repository<VisaRequiredDocuments>,
  ) {}

  async createVisaAll(visaAllDto: VisaAllDto): Promise<Visa> {
  
    const visa = this.visaRepository.create({
      departureCountry: visaAllDto.departureCountry,
      arrivalCountry: visaAllDto.arrivalCountry,
      visaCategory: visaAllDto.visaCategory,
      visaType: visaAllDto.visaType,
      cost: visaAllDto.cost,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    
    const savedVisa = await this.visaRepository.save(visa);

    
    if (visaAllDto.durationCosts) {
      const durationCosts = visaAllDto.durationCosts.map(durationCostDto => {
        const durationCost = this.durationCostRepository.create({
          cost: durationCostDto.cost,
          entry: durationCostDto.entry,
          duration: durationCostDto.duration,
          maximumStay: durationCostDto.maximumStay,
          processingTime: durationCostDto.processingTime,
          visa: savedVisa,
        });
        return this.durationCostRepository.save(durationCost);
      });
      await Promise.all(durationCosts);
    }

    
    if (visaAllDto.visaRequiredDocuments) {
      const visaRequiredDocuments = visaAllDto.visaRequiredDocuments.map(docDto => {
        const visaDocs = this.visaRequiredDocumentsRepository.create({
          profession: docDto.profession,
          documents: docDto.documents,
          exceptionalCase: docDto.exceptionalCase,
          note: docDto.note,
          visa: savedVisa,
        });
        return this.visaRequiredDocumentsRepository.save(visaDocs);
      });
      await Promise.all(visaRequiredDocuments);
    }

    return savedVisa;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Visa[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.visaRepository.findAndCount({
      relations: ['durationCosts', 'visaRequiredDocuments'],
      skip: (page - 1) * limit, 
      take: limit, 
    });
  
    return {
      data, 
      total, 
      page, 
      limit, 
    };
  }
  

  async findOne(id: number): Promise<Visa> {
    const visa =await this.visaRepository.findOne({
      where: { id }, // Condition to find by ID
      relations: ['durationCosts', 'visaRequiredDocuments'], 
    });
if(!visa){
    throw new NotFoundException()
}return visa
  }

  async deleteVisa(id: number): Promise<any> {
    const visa = await this.visaRepository.findOne({
        where: { id }, // Condition to find by ID
        relations: ['durationCosts', 'visaRequiredDocuments'], 
      });
      
    if (!visa) {
      throw new NotFoundException
    }
    return await this.visaRepository.remove(visa); 
  }
}
