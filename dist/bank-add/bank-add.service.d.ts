import { BankAdd, CreateBankAddDto } from './bank-add.model';
import { Repository } from 'typeorm';
export declare class BankAddService {
    private readonly bankAddRepository;
    constructor(bankAddRepository: Repository<BankAdd>);
    create(createBankAddDto: CreateBankAddDto): Promise<BankAdd>;
    getallBank(): Promise<BankAdd[]>;
    getOne(id: number): Promise<BankAdd>;
    getAllAccount(): Promise<BankAdd[]>;
    update(id: number, updateBankAddDto: CreateBankAddDto): Promise<BankAdd>;
}
