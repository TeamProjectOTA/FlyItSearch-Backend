import { User } from 'src/user/entities/user.entity';
export declare class Deposit {
    id: number;
    depositType: string;
    depositId: string;
    senderName: string;
    referance: string;
    ammount: number;
    chequeNumber: string;
    chequeBankName: string;
    chequeIssueDate: string;
    depositedAccount: string;
    transferDate: string;
    depositedFrom: string;
    transectionId: string;
    status: string;
    createdAt: string;
    actionAt: string;
    receiptImage: string;
    rejectionReason: string;
    user: User;
}
export declare class Wallet {
    id: number;
    ammount: number;
    user: User;
}
export declare class DepositDto {
    amount: number;
}
