import { BankAdd, CreateBankAddDto } from './bank-add.model';
import { Repository } from 'typeorm';
export declare class BankAddService {
    private readonly bankAddRepository;
    constructor(bankAddRepository: Repository<BankAdd>);
    create(createBankAddDto: CreateBankAddDto): Promise<BankAdd>;
    getallBank(): Promise<BankAdd[]>;
}
