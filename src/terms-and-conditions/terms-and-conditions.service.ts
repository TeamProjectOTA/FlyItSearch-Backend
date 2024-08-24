import { Injectable } from '@nestjs/common';
import { CreateTermsAndConditionDto } from './dto/create-terms-and-condition.dto';
import { UpdateTermsAndConditionDto } from './dto/update-terms-and-condition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TermsAndCondition } from './entities/terms-and-condition.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TermsAndConditionsService {
  constructor(
    @InjectRepository(TermsAndCondition)
    private readonly termAndConditionRepository: Repository<TermsAndCondition>,
  ) {}

  findAll() {
    return this.termAndConditionRepository.find();
  }

  update(id: number, updateTermsAndConditionDto: UpdateTermsAndConditionDto) {
    return `This action updates a #${id} termsAndCondition`;
  }

  remove(id: number) {
    return `This action removes a #${id} termsAndCondition`;
  }
}
