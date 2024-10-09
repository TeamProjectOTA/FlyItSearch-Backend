import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAdd, CreateBankAddDto } from './bank-add.model';
import { Repository } from 'typeorm';

@Injectable()
export class BankAddService {
    constructor(@InjectRepository(BankAdd)private readonly bankAddRepository:Repository<BankAdd>){}

    async create(createBankAddDto: CreateBankAddDto): Promise<BankAdd> {
        const bankAdd = this.bankAddRepository.create(createBankAddDto);
        return await this.bankAddRepository.save(bankAdd);
    }

    async getallBank(){
        return this.bankAddRepository.find()
    }
}
