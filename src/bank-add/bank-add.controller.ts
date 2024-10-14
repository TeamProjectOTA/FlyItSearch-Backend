import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BankAddService } from './bank-add.service';
import { BankAdd, CreateBankAddDto } from './bank-add.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AddBank')
@Controller('bankAdd')
export class BankAddController {
  constructor(private readonly bankAddService: BankAddService) {}
  @Post()
  async create(@Body() createBankAddDto: CreateBankAddDto): Promise<BankAdd> {
    return this.bankAddService.create(createBankAddDto);
  }

  @Get('/allbank')
  async getAll() {
    return this.bankAddService.getallBank();
  }
  @Get('admin/allBank')
  async getAllaccount() {
    return this.bankAddService.getAllAccount();
  }
  @Get('admin/oneBank/:id')
  async geOne(@Param('id') id: number) {
    return this.bankAddService.getOne(id);
  }
  @Patch('admin/update/:id')
  async update(
    @Param('id') id: number,
    @Body() createBankAddDto: CreateBankAddDto,
  ) {
    return this.bankAddService.update(id, createBankAddDto);
  }
}
