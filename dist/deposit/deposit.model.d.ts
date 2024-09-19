import { User } from 'src/user/entities/user.entity';
export declare class Deposit {
    id: number;
    depositType: string;
    depositId: string;
    branch: string;
    senderName: string;
    referance: string;
    ammount: number;
    chequeNumber: string;
    chequeBankName: string;
    chequeIssueDate: string;
    depositedAccount: string;
    transferDate: string;
    depositedFrom: string;
    status: string;
    createdAt: string;
    actionAt: string;
    rejectionReason: string;
    user: User;
}
export declare class Wallet {
    id: number;
    ammount: number;
    user: User;
}
