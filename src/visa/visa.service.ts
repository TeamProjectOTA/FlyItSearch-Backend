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
      const durationCosts = visaAllDto.durationCosts.map((durationCostDto) =>
        this.durationCostRepository.create({
          ...durationCostDto,
          visa: savedVisa, 
        }),
      );
      
      await this.durationCostRepository.save(durationCosts);
    }
  
    if (visaAllDto.visaRequiredDocuments) {
      const visaRequiredDocument = visaAllDto.visaRequiredDocuments; 
      const visaDocs = this.visaRequiredDocumentsRepository.create({
        ...visaRequiredDocument,
        createdAt: new Date(),
        updatedAt: new Date(),
        visa: savedVisa, 
      });
      await this.visaRequiredDocumentsRepository.save(visaDocs);
    }
  
    return savedVisa;
  }
  
  async findAll(page: number = 1, limit: number = 10): Promise<any> {
    const [data, total] = await this.visaRepository.findAndCount({
      order: { id: "DESC" },
      relations: ['durationCosts', 'visaRequiredDocuments'],
      skip: (page - 1) * limit, 
      take: limit, 
      select: [
        'id',
        'departureCountry', 
        'arrivalCountry', 
        'visaCategory', 
        'visaType', 
        'cost', 
      ],
    });
  
   
    data.forEach((visa) => {
      delete visa.id
      if (visa.visaRequiredDocuments) {
        delete visa.visaRequiredDocuments.id;
        delete visa.visaRequiredDocuments.createdAt;
        delete visa.visaRequiredDocuments.updatedAt;
      }
      if (visa.durationCosts) {
        visa.durationCosts.forEach((durationCost) => {
          delete durationCost.id;
        });
      }
    });
  
    const totalPages = Math.ceil(total / limit);
    
    return {
      data, 
      total, 
      page, 
      limit, 
      totalPages
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
  async updateVisaAll(id: number, visaAllDto: VisaAllDto): Promise<Visa> {
    const existingVisa = await this.visaRepository.findOne({
      where: { id },
      relations: ['durationCosts', 'visaRequiredDocuments'],
    });
  
    if (!existingVisa) {
      throw new Error('Visa not found');
    }
    existingVisa.departureCountry = visaAllDto.departureCountry;
    existingVisa.arrivalCountry = visaAllDto.arrivalCountry;
    existingVisa.visaCategory = visaAllDto.visaCategory;
    existingVisa.visaType = visaAllDto.visaType;
    existingVisa.cost = visaAllDto.cost;
    existingVisa.updatedAt = new Date(); 
    const updatedVisa = await this.visaRepository.save(existingVisa);
  
    if (visaAllDto.durationCosts) {
     
      await this.durationCostRepository.delete({ visa: existingVisa });
      const durationCosts = visaAllDto.durationCosts.map((durationCostDto) =>
        this.durationCostRepository.create({
          ...durationCostDto,
          visa: updatedVisa,
        }),
      );
      await this.durationCostRepository.save(durationCosts);
    }
    if (visaAllDto.visaRequiredDocuments) {
      const visaRequiredDocument = visaAllDto.visaRequiredDocuments; 
  
      if (existingVisa.visaRequiredDocuments) {
        existingVisa.visaRequiredDocuments.profession = visaRequiredDocument.profession;
        existingVisa.visaRequiredDocuments.documents = visaRequiredDocument.documents;
        existingVisa.visaRequiredDocuments.exceptionalCase = visaRequiredDocument.exceptionalCase;
        existingVisa.visaRequiredDocuments.note = visaRequiredDocument.note;
        existingVisa.visaRequiredDocuments.updatedAt = new Date(); 
  
        await this.visaRequiredDocumentsRepository.save(existingVisa.visaRequiredDocuments);
      } else {
        const visaDocs = this.visaRequiredDocumentsRepository.create({
          ...visaRequiredDocument,
          createdAt: new Date(),
          updatedAt: new Date(),
          visa: updatedVisa,
        });
        await this.visaRequiredDocumentsRepository.save(visaDocs);
      }
    }
    return updatedVisa;
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
