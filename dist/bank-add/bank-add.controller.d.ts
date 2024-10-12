import { BankAddService } from './bank-add.service';
import { BankAdd, CreateBankAddDto } from './bank-add.model';
export declare class BankAddController {
    private readonly bankAddService;
    constructor(bankAddService: BankAddService);
    create(createBankAddDto: CreateBankAddDto): Promise<BankAdd>;
    getAll(): Promise<BankAdd[]>;
    getAllaccount(): Promise<BankAdd[]>;
    geOne(id: number): Promise<BankAdd>;
    update(id: number, createBankAddDto: CreateBankAddDto): Promise<BankAdd>;
}
