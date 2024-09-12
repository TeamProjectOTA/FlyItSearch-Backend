import { User } from 'src/user/entities/user.entity';
export declare class CreateTransectionDTO {
    tranId: string;
    tranDate?: string;
    paidAmount?: string;
    offerAmmount?: string;
    bankTranId?: string;
    riskTitle?: string;
    cardType?: string;
    cardIssuer?: string;
    cardBrand?: string;
    cardIssuerCountry?: string;
    validationDate?: string;
}
export declare class Transection {
    id: number;
    tranId: string;
    tranDate: string;
    paidAmount: string;
    offerAmmount: string;
    bankTranId: string;
    riskTitle: string;
    cardType: string;
    cardIssuer: string;
    cardBrand: string;
    cardIssuerCountry: string;
    validationDate: string;
    user: User;
}
