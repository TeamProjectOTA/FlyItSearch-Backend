import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAdd, CreateBankAddDto } from './bank-add.model';
import { Repository } from 'typeorm';

@Injectable()
export class BankAddService {
    constructor(@InjectRepository(BankAdd)private readonly bankAddRepository:Repository<BankAdd>){}

    async create(createBankAddDto: CreateBankAddDto): Promise<BankAdd> {

        const bankAdd = this.bankAddRepository.create({
            ...createBankAddDto,
            accountHolderName: createBankAddDto.accountHolderName.toUpperCase(),
            bankName: createBankAddDto.bankName.toUpperCase(),
            branchName: createBankAddDto.branchName.toUpperCase(),    
        });
        return await this.bankAddRepository.save(bankAdd);
    }

    async getallBank() {
        return this.bankAddRepository
            .createQueryBuilder('bank')
            .select(['bank.accountHolderName','bank.bankName','bank.branchName', 'bank.accountNumber'])
            .getMany();
    }
    async getOne(id:number){
    return await this.bankAddRepository.findOne({where:{id:id}})
    }
    async getAllAccount(){
        return await this.bankAddRepository.find({order: {
            id: 'DESC'
          }})
    }
    async update(id: number, updateBankAddDto: CreateBankAddDto): Promise<BankAdd> {
        const bankAccount = await this.bankAddRepository.findOne({where:{id:id}});
        if (!bankAccount) {
          throw new NotFoundException(`Bank account with ID ${id} not found`);
        }
        Object.assign(bankAccount, updateBankAddDto);
    
        return this.bankAddRepository.save(bankAccount);
      }
}
