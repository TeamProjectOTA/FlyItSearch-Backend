import { DurationCost } from './duration-cost.entity';
import { VisaRequiredDocuments } from './visa-required-documents.entity';
export declare class Visa {
    id: number;
    departureCountry: string;
    arrivalCountry: string;
    visaCategory: string;
    visaType: string;
    cost: number;
    createdAt: Date;
    updatedAt: Date;
    durationCosts: DurationCost[];
    visaRequiredDocuments: VisaRequiredDocuments;
}
