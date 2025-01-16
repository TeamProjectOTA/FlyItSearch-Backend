import { Visa } from './visa.entity';
export declare class VisaRequiredDocuments {
    id: number;
    profession: string;
    documents: string;
    exceptionalCase: string;
    note: string;
    createdAt: Date;
    updatedAt: Date;
    visa: Visa;
}
