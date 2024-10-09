import { Body, Controller, Get, Post } from '@nestjs/common';
import { BankAddService } from './bank-add.service';
import { BankAdd, CreateBankAddDto } from './bank-add.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("AddBank")
@Controller('bankAdd')
export class BankAddController {
  constructor(private readonly bankAddService: BankAddService) {}
  @Post()
  async create(@Body() createBankAddDto: CreateBankAddDto): Promise<BankAdd> {
      return this.bankAddService.create(createBankAddDto);
  }

  @Get('/allbank')
  async getAll(){
    return this.bankAddService.getallBank()
  }
}
