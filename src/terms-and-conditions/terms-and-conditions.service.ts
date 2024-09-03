import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAllSite(catagory: string) {
    const condition = await this.termAndConditionRepository.findOne({
      where: { catagory: catagory },
    });
    if (!condition) {
      throw new NotFoundException(
        `No Terms and Conditons found on ${catagory}. Contect with +8801302086413`,
      );
    }
    return condition;
  }
  async updateSite(
    updateTermsAndConditionDto: UpdateTermsAndConditionDto,
    catagory: string,
  ) {
    const text = await this.termAndConditionRepository.findOne({
      where: { catagory: catagory },
    });
    if (!text) {
      throw new NotFoundException();
    }
    text.text = updateTermsAndConditionDto.text;
    const Updated = await this.termAndConditionRepository.save(text);
    return {
      message: `The term and condition has been changed ..................from................. ${text.text} </br> .........................................TO.......................................................... ${Updated.text}`,
    };
  }
}
