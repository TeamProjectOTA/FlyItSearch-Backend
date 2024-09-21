import { User } from 'src/user/entities/user.entity';
export declare class Transection {
    id: number;
    tranId: string;
    tranDate: string;
    bookingId: string;
    paidAmount: string;
    offerAmmount: string;
    bankTranId: string;
    riskTitle: string;
    cardType: string;
    cardIssuer: string;
    cardBrand: string;
    cardIssuerCountry: string;
    validationDate: string;
    status: string;
    currierName: string;
    requestType: string;
    walletBalance: number;
    paymentType: string;
    user: User;
}
